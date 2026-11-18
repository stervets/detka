import tailwindcss from '@tailwindcss/vite';
import content from './content.json';
const siteUrl = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/,'');
export default defineNuxtConfig({
 compatibilityDate:'2026-01-01',
 devtools:{enabled:false},
 css:['~/assets/main.less','~/assets/tailwind.css'],
 vite:{plugins:[tailwindcss()]},
 alias:{'@content':new URL('./content.json',import.meta.url).pathname},
 app:{head:{htmlAttrs:{lang:'ru'},link:[{rel:'icon',type:'image/png',href:'/favicon.png'}]}},
 runtimeConfig:{public:{siteUrl,indexable:process.env.SITE_INDEXABLE==='true',apiBase:'/api'}},
 nitro:{...(process.env.NITRO_OUTPUT_DIR?{output:{dir:process.env.NITRO_OUTPUT_DIR,publicDir:process.env.NITRO_OUTPUT_DIR+'/public',serverDir:process.env.NITRO_OUTPUT_DIR+'/server'}}:{}),prerender:{crawlLinks:true,failOnError:true,routes:content.pages.map(page=>page.path)}},
 devServer:{host:'127.0.0.1'},
 routeRules:{'/api/**':{proxy:'http://127.0.0.1:3001/api/**'}}
});
