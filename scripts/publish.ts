import { mkdirSync, writeFileSync, symlinkSync, renameSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { openDatabase } from '../backend/db';
import { readContent } from '../backend/content';
async function main(){
mkdirSync('storage',{recursive:true});
let lock;
try { lock = await import('node:fs').then(fs=>fs.promises.open('storage/publish.lock','wx')); }
catch { throw new Error('Публикация уже выполняется. Если процесс прерван, проверьте и удалите storage/publish.lock.'); }
const database = openDatabase();
let publicationId:number|undefined;
try {
 const snapshot=readContent();
 const hash=createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
 publicationId=Number(database.prepare("INSERT INTO publications(status,content_hash) VALUES('building',?)").run(hash).lastInsertRowid);
 writeFileSync('web/content.json',JSON.stringify(snapshot,null,2));
 await import('./seo');
 const release=resolve('storage/releases',String(publicationId));
 const result=spawnSync('yarn',['nuxt','generate','web'],{stdio:'inherit',env:{...process.env,NITRO_OUTPUT_DIR:release}});
 if(result.status!==0) throw new Error('Ошибка генерации; предыдущая публикация сохранена');
 const {writeFallback}=await import('./fallback');
 writeFallback(resolve(release,'public'));
 symlinkSync(resolve(release,'public'), 'storage/current.next','dir');
 renameSync('storage/current.next','storage/current');
 database.prepare("UPDATE publications SET status='published',finished_at=CURRENT_TIMESTAMP WHERE id=?").run(publicationId);
 console.log('Опубликована локальная версия',publicationId);
} catch(error) {
 if(publicationId) database.prepare("UPDATE publications SET status='failed',finished_at=CURRENT_TIMESTAMP,error=? WHERE id=?").run(String(error),publicationId);
 throw error;
} finally {database.close(); await lock.close(); rmSync('storage/publish.lock');}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
