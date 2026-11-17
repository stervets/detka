import 'reflect-metadata';
import { Body, Controller, Get, HttpException, HttpCode, Module, Post, Req } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { createHash } from 'node:crypto';
import { openDatabase } from './db';
const consentVersion = 'callback-draft-v1';
@Controller('api')
class PublicController {
 @Get('health') health() { return { status:'ok', mail:'mock' }; }
 @Post('callbacks')
 @HttpCode(201)
 callback(@Body() body: unknown, @Req() request: { ip: string; headers: Record<string,string|undefined> }) {
  const origin = request.headers.origin;
  const allowedOrigin = process.env.WEB_ORIGIN || 'http://localhost:3000';
  if (origin && origin !== allowedOrigin) throw new HttpException('Недопустимый источник запроса',403);
  if (!body || typeof body !== 'object') throw new HttpException('Неверный формат заявки',400);
  const input = body as Record<string,unknown>;
  const name = typeof input.name==='string'?input.name.trim():'';
  const phone = typeof input.phone==='string'?input.phone.trim():'';
  const comment = typeof input.comment==='string'?input.comment.trim():'';
  if (input.website) throw new HttpException('Не удалось принять заявку',400);
  if (name.length<2 || name.length>80 || !/^[\p{L}\p{M}\s.'’-]+$/u.test(name) ||
      !/^[+\d\s()\-]+$/.test(phone) || phone.replace(/\D/g,'').length<10 || phone.replace(/\D/g,'').length>15 ||
      comment.length>1000 || input.consent!==true) throw new HttpException('Проверьте имя, телефон и согласие',400);
  const database = openDatabase();
  try {
   const ipHash = createHash('sha256').update(request.ip).digest('hex');
   const now = Date.now();
   database.exec('BEGIN IMMEDIATE');
   const limit = database.prepare('SELECT window_start,attempts FROM rate_limits WHERE ip_hash=?').get(ipHash);
   if (limit && now-Number(limit.window_start)<900000 && Number(limit.attempts)>=5) {
    database.exec('ROLLBACK'); throw new HttpException('Слишком много заявок. Попробуйте через 15 минут.',429);
   }
   database.prepare('DELETE FROM rate_limits WHERE window_start < ?').run(now-900000);
   database.prepare('INSERT INTO rate_limits VALUES(?,?,1) ON CONFLICT(ip_hash) DO UPDATE SET attempts=attempts+1').run(ipHash,now);
   const result = database.prepare('INSERT INTO callbacks(name,phone,comment,consent_version) VALUES(?,?,?,?)').run(name,phone,comment,consentVersion);
   database.exec('COMMIT');
   const id = Number(result.lastInsertRowid);
   console.info(JSON.stringify({event:'notification_attempt',callbackId:id,transport:'mock'}));
   try {
    if (process.env.MOCK_EMAIL_FAIL==='1') throw new Error('mock failure');
    database.prepare('INSERT INTO notification_attempts(callback_id,result) VALUES(?,?)').run(id,'mock_sent');
    database.prepare("UPDATE callbacks SET notification_status='mock_sent' WHERE id=?").run(id);
    console.info(JSON.stringify({event:'notification_result',callbackId:id,result:'mock_sent'}));
   } catch {
    database.prepare('INSERT INTO notification_attempts(callback_id,result) VALUES(?,?)').run(id,'mock_failed');
    database.prepare("UPDATE callbacks SET notification_status='mock_failed' WHERE id=?").run(id);
    console.warn(JSON.stringify({event:'notification_result',callbackId:id,result:'mock_failed'}));
   }
   return { ok:true };
  } finally { database.close(); }
 }
}
@Module({controllers:[PublicController]})
class AppModule {}
export async function createApp() {
 const app = await NestFactory.create<NestFastifyApplication>(AppModule,new FastifyAdapter({bodyLimit:8192,trustProxy:false}),{logger:['error','warn']});
 app.enableCors({origin:process.env.WEB_ORIGIN || 'http://localhost:3000',methods:['GET','POST']});
 app.enableShutdownHooks();
 return app;
}
