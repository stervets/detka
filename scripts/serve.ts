import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { readFileSync, realpathSync, existsSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
async function main(){
 const app=Fastify();
 app.post('/api/callbacks',async(request,reply)=>{
  const response=await fetch('http://127.0.0.1:3001/api/callbacks',{method:'POST',headers:{'Content-Type':'application/json',...(request.headers.origin?{Origin:request.headers.origin}:{})},body:JSON.stringify(request.body)});
  return reply.code(response.status).send(await response.json());
 });
 await app.register(fastifyStatic,{root:resolve('frontend/.output/public'),serve:false});
 app.get('/*',async(request,reply)=>{
  const root=process.env.STATIC_ROOT?resolve(process.env.STATIC_ROOT):existsSync('storage/current')?realpathSync('storage/current'):resolve('frontend/.output/public');
  let path:string;
  try{path=decodeURIComponent(request.url.split('?')[0]!);}catch{return reply.code(400).send('Некорректный URL');}
  let candidate=resolve(root,'.'+path);
  if(candidate!==root && !candidate.startsWith(root+'/'))return reply.code(404).send();
  if(existsSync(candidate)&&statSync(candidate).isDirectory())candidate=resolve(candidate,'index.html');
  if(existsSync(candidate)&&statSync(candidate).isFile())return reply.sendFile(relative(root,candidate),root);
  return reply.code(404).type('text/html').send(readFileSync(resolve(root,'404.html')));
 });
 await app.listen({port:3000,host:'127.0.0.1'});
}
main().catch(error=>{console.error(error);process.exitCode=1;});
