import { openDatabase } from './db';
import { demoContent } from '../shared/demo';
const database = openDatabase();
database.exec('BEGIN');
try {
 const insert = database.prepare('INSERT OR IGNORE INTO content(kind,slug,payload,visible,sort_order) VALUES(?,?,?,1,?)');
 demoContent.pages.forEach((page,index) => insert.run(page.path.startsWith('/services/')?'service':page.path.startsWith('/specialists/')?'employee':page.kind==='article'?'article':'page',page.path,JSON.stringify(page),index));
 insert.run('settings','center',JSON.stringify(demoContent.settings),0);
 database.exec('COMMIT');
} catch(error) { database.exec('ROLLBACK'); throw error; }
database.close();
console.log('Демонстрационный контент добавлен; существующие записи сохранены');
