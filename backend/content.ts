import type { SiteContent, Page } from '../shared/content';
import { openDatabase } from './db';
export function readContent(): SiteContent {
 const database = openDatabase();
 try {
 const records = database.prepare("SELECT payload FROM content WHERE visible=1 AND kind IN ('page','service','employee','article') ORDER BY sort_order").all();
 const settings = database.prepare("SELECT payload FROM content WHERE kind='settings' AND slug='center'").get();
 if (!records.length || !settings) throw new Error('Нет контента. Выполните yarn db:seed.');
 return { pages: records.map(record => JSON.parse(String(record.payload)) as Page), settings: JSON.parse(String(settings.payload)) };
 } finally { database.close(); }
}
