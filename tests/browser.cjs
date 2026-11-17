const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {spawn}=require('node:child_process');
const {mkdirSync,mkdtempSync,rmSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {join}=require('node:path');
const assert=require('node:assert/strict');
async function main(){
 const directory=mkdtempSync(join(tmpdir(),'detka-browser-'));
 const children=[];
 let browser;
 const errors=[];
 try {
  for(const args of [['node_modules/tsx/dist/cli.mjs','--tsconfig','backend/tsconfig.json','backend/main.ts'],['node_modules/tsx/dist/cli.mjs','scripts/serve.ts']]){
   const child=spawn(process.execPath,args,{detached:true,stdio:'ignore',env:{...process.env,DB_PATH:join(directory,'test.sqlite'),STATIC_ROOT:'web/.output/public'}});
   children.push(child);
  }
  for(let attempt=0;attempt<80;attempt++){
   try{if((await fetch('http://localhost:3000')).ok&&(await fetch('http://localhost:3001/api/health')).ok)break;}catch{}
   if(attempt===79)throw new Error('Серверы не запустились');
   await new Promise(resolve=>setTimeout(resolve,200));
  }
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH,args:['--disable-gpu']});
  mkdirSync('test-results',{recursive:true});
  const paths=['/','/about','/services','/services/family-meeting','/services/parent-support','/specialists','/specialists/demo','/gallery','/parents','/parents/first-visit','/parents/questions','/contacts','/privacy'];
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
   const page=await browser.newPage({viewport});
   page.on('pageerror',error=>errors.push(error.message));
   page.on('console',message=>{if(message.type()==='error' && !message.text().includes('yandex'))errors.push(message.text());});
   for(const path of paths){
    const response=await page.goto('http://localhost:3000'+path,{waitUntil:'networkidle'});
    assert.equal(response.status(),200,path);
    assert.equal(await page.locator('h1').count(),1,path);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),path+' horizontal overflow');
    await page.locator('img').evaluateAll(async images=>{
     for(const image of images)image.loading='eager';
     await Promise.all(images.map(image=>image.decode()));
    });
    if(path==='/')await page.screenshot({path:'test-results/home-'+viewport.width+'.png',fullPage:true});
   }
   if(viewport.width===390){
    await page.goto('http://localhost:3000/');
    await page.getByRole('button',{name:'Меню'}).click();
    await page.locator('#main-nav').getByRole('link',{name:'Контакты'}).click();
    await page.waitForURL('**/contacts');
    await page.getByRole('heading',{level:1,name:'Знакомство начинается здесь'}).waitFor();
   }
   await page.goto('http://localhost:3000/');
   await page.getByRole('textbox',{name:'Ваше имя'}).fill('Тестовая Заявка');
   await page.getByRole('textbox',{name:'Телефон',exact:true}).fill('+7 (000) 000-00-00');
   await page.getByRole('checkbox').check();
   await page.getByRole('button',{name:'Заказать обратный звонок'}).click();
   await page.getByRole('status').filter({hasText:'Заявка сохранена'}).waitFor();
   await page.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://localhost:3000/services/family-meeting');
  assert.ok((await page.locator('h1').textContent()).includes('Знакомство'));
  const response=await page.goto('http://localhost:3000/missing-page');
  assert.equal(response.status(),404);
  assert.ok((await page.locator('h1').textContent()).includes('Такой страницы нет'));
  assert.deepEqual(errors,[]);
  console.log('OK: 13 маршрутов × desktop/mobile, меню, 2 заявки, HTML без JS, HTTP 404, без ошибок консоли.');
 }finally{
  if(browser)await browser.close();
  for(const child of children){try{process.kill(-child.pid,'SIGTERM');}catch{}}
  await Promise.all(children.map(child=>child.exitCode!==null?Promise.resolve():new Promise(resolve=>child.once('exit',resolve))));
  rmSync(directory,{recursive:true,force:true});
  console.log('Остановлены тестовые process groups:',children.map(child=>child.pid).join(', '));
 }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
