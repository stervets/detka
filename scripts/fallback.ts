import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
export function writeFallback(root=resolve('frontend/.output/public')){
 writeFileSync(resolve(root,'404.html'),'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Страница не найдена — Детка Плюс</title><style>body{margin:0;background:#fff4d6;color:#303e35;font:18px/1.7 Arial}main{max-width:760px;padding:12vh 24px;margin:auto}h1{font:clamp(34px,6vw,58px)/1.2 Georgia}a{color:#a20960}</style></head><body><main><p>Детка Плюс · 404</p><h1>Такой страницы нет</h1><p>Проверьте адрес или откройте нужный раздел с главной страницы.</p><a href="/">Перейти на главную →</a></main></body></html>');
}
if(process.argv[1]?.endsWith('fallback.ts'))writeFallback();
