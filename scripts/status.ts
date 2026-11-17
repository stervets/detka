import { openDatabase } from '../backend/db';
import { readContent } from '../backend/content';
import { createHash } from 'node:crypto';
const database = openDatabase();
const hash = createHash('sha256').update(JSON.stringify(readContent())).digest('hex');
const latestAttempt = database.prepare('SELECT * FROM publications ORDER BY id DESC LIMIT 1').get();
const published = database.prepare("SELECT * FROM publications WHERE status='published' ORDER BY id DESC LIMIT 1").get();
console.log(JSON.stringify({latestAttempt,published,unpublishedChanges:!published || published.content_hash!==hash},null,2));
database.close();
