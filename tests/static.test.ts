import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {demoContent} from '../shared/demo';
test('SSG: все маршруты содержат HTML, SEO и структурированные данные',()=>{
 const titles=new Set<string>();
 for(const page of demoContent.pages){
  const filename='web/.output/public'+(page.path==='/'?'':page.path)+'/index.html';
  assert.ok(existsSync(filename),filename);
  const html=readFileSync(filename,'utf8');
  const withoutScripts=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  assert.ok(withoutScripts.includes(page.heading.split('\n')[0]!),page.path+' heading');
  assert.ok(withoutScripts.includes(page.sections[0]!.title),page.path+' body');
  assert.ok(html.includes('rel="canonical"'));
  assert.ok(html.includes('property="og:title"'));
  assert.ok(html.includes('application/ld+json'));
  assert.ok(html.includes('name="description"'));
  assert.ok(!titles.has(page.title));titles.add(page.title);
 }
 assert.ok(readFileSync('web/.output/public/sitemap.xml','utf8').includes('/contacts'));
 assert.ok(readFileSync('web/.output/public/robots.txt','utf8').includes('Disallow: /'));
 assert.ok(readFileSync('web/.output/public/404.html','utf8').includes('Такой страницы нет'));
});
