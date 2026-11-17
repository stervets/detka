import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApp} from '../backend/app';
import {openDatabase} from '../backend/db';
test('Заявки: валидация, сохранение, сбой mock и лимит',async()=>{
 const directory=mkdtempSync(join(tmpdir(),'detka-test-'));
 process.env.DB_PATH=join(directory,'test.sqlite');
 process.env.MOCK_EMAIL_FAIL='1';
 const app=await createApp();
 try{
 await app.init();await app.getHttpAdapter().getInstance().ready();
 const server=app.getHttpAdapter().getInstance();
 const payload={name:'Тестовая Заявка',phone:'+7 (000) 000-00-00',comment:'Вымышленные данные',consent:true};
 const post=(body:unknown,origin='http://localhost:3000')=>server.inject({method:'POST',url:'/api/callbacks',payload:body,headers:{origin}});
 assert.equal((await post({...payload,consent:false})).statusCode,400);
 assert.equal((await post({...payload,phone:'123'})).statusCode,400);
 assert.equal((await post({...payload,website:'bot'})).statusCode,400);
 assert.equal((await post(payload,'https://wrong.example')).statusCode,403);
 assert.equal((await post(payload)).statusCode,201);
 const database=openDatabase();
 assert.equal(database.prepare('SELECT count(*) AS total FROM callbacks').get()!.total,1);
 assert.equal(database.prepare('SELECT notification_status FROM callbacks').get()!.notification_status,'mock_failed');
 assert.equal(database.prepare('SELECT count(*) AS total FROM notification_attempts').get()!.total,1);
 process.env.MOCK_EMAIL_FAIL='0';
 for(let index=0;index<4;index++)assert.equal((await post(payload)).statusCode,201);
 assert.equal((await post(payload)).statusCode,429);
 assert.equal(database.prepare('SELECT count(*) AS total FROM callbacks').get()!.total,5);
 database.close();
 }finally{await app.close();rmSync(directory,{recursive:true,force:true});delete process.env.DB_PATH;delete process.env.MOCK_EMAIL_FAIL;}
});
