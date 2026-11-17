import { openDatabase } from './db';
openDatabase().close();
console.log('Миграция SQLite выполнена');
