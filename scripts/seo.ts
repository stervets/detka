import { writeFileSync } from 'node:fs';
import { readContent } from '../backend/content';
export function writeSeo() {
 const siteUrl=(process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/,'');
 const parsed=new URL(siteUrl);
 if(!['http:','https:'].includes(parsed.protocol) || parsed.pathname!=='/') throw new Error('SITE_URL должен быть origin');
 const indexable=process.env.SITE_INDEXABLE==='true';
 if(indexable && (parsed.hostname==='localhost'||parsed.hostname==='127.0.0.1'))throw new Error('Для индексации укажите реальный домен');
 const escape=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
 writeFileSync('frontend/public/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+readContent().pages.filter(page=>page.path!=='/privacy').map(page=>'<url><loc>'+escape(siteUrl+page.path)+'</loc></url>').join('')+'</urlset>');
 writeFileSync('frontend/public/robots.txt','User-agent: *\n'+(indexable?'Allow: /\nDisallow: /api/\nDisallow: /admin/':'Disallow: /')+'\nSitemap: '+siteUrl+'/sitemap.xml\n');
}
writeSeo();
