import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import { keccak256, toBytes } from 'viem';
const base = process.env.CERTIFICATE_URL || 'http://127.0.0.1:8081';
const record={status:'issued',participant_name:'Alex Example',event_name:'Blockchain Foundations',speaker_name:'UTAAB Education',event_date:'2026-09-20',location:'Istanbul',issued_by:'UTAAB',organizer:'UTAAB Education',partners:['University community'],certificate_title:'Certificate of Participation',serial_number:'UTAAB-TEST-2026',issued_at:'2026-09-21T10:00:00Z',blockchain_tx_hash:'0x'+'a'.repeat(64),contract_address:'0x'+'1'.repeat(40)};
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 let mode='valid',configured=false,delay=150,calls=0,chainCalls=0;const errors=[];
 await context.route('**/*',async route=>{
  const req=route.request(),url=req.url();
  if(url.includes('/rest/v1/'))return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  if(url.includes('/src/lib/web3/wagmi.ts')&&configured){
   const response=await route.fetch();const text=await response.text();
   const patched=text.replace(/export const isContractConfigured =[\s\S]*?;/,'export const isContractConfigured = true;');
   assert.notEqual(patched,text,'configured module patch');
   return route.fulfill({response,body:patched});
  }
  if(url.includes('/functions/v1/cert-pdf-url')){
   calls++; const requestMode=mode; const payload=req.postDataJSON();
   const old=payload.serial_hash===keccak256(toBytes('OLD'));
   await new Promise(r=>setTimeout(r,old?750:delay));
   if(requestMode==='error'||requestMode==='chainOnly')return route.fulfill({status:500,contentType:'application/json',body:'{"error":"mock failure"}'});
   const data=requestMode==='missing'?{found:false,record:null,url:null}:{found:true,record:{...record,status:requestMode==='revoked'?'revoked':'issued',participant_name:old?'OLD RESULT':requestMode==='long'?'A very long participant name '.repeat(14):record.participant_name,serial_number:requestMode==='long'?'UTAAB-'.repeat(30):record.serial_number,event_date:requestMode==='long'?'invalid-date':record.event_date,revoked_at:requestMode==='revoked'?'2026-09-22T12:00:00Z':null,revocation_reason:requestMode==='revoked'?'Replaced by corrected certificate':null},url:requestMode==='noPdf'?null:'https://example.org/certificate.pdf'};
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  }
  if(url.includes('/functions/v1/'))return route.fulfill({status:200,contentType:'application/json',body:'{}'});
  if(req.method()==='POST'){
   let body;try{body=req.postDataJSON()}catch{}
   if(body?.method==='eth_call'){
    chainCalls++;
    if(mode==='error')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({jsonrpc:'2.0',id:body.id,error:{code:-32000,message:'mock RPC failure'}})});
    const issued=mode!=='missing',revoked=mode==='revoked';
    const data='0x'+[issued&&!revoked?1:0,issued?1:0,revoked?1:0,0,0,0,0].map(n=>n.toString(16).padStart(64,'0')).join('');
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({jsonrpc:'2.0',id:body.id,result:data})});
   }
  }
  return route.continue();
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(!localStorage.getItem('i18nextLng'))localStorage.setItem('i18nextLng','en')});
 const load=async(url='/verify-certificate')=>{await page.goto(base+url);await page.waitForSelector('.cv-certificate-face')};
 await load();
 await page.locator('.cv-search-row button').click();
 assert.equal(await page.locator('#certificate-input-error').isVisible(),true);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'certificate-serial');assert.equal(calls,0);
 for(const lang of ['en','tr','ru','ar']){
  await page.evaluate(lang=>localStorage.setItem('i18nextLng',lang),lang);await page.reload();await page.waitForSelector('.cv-certificate-face');
  for(const width of [1440,1024,768,390,320]){
   await page.setViewportSize({width,height:1000});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${lang} overflow ${width}`);
   const b=await page.locator('.cv-certificate').boundingBox();assert.ok(b.x>=0&&b.x+b.width<=width,`${lang} certificate clipped ${width}: ${JSON.stringify(b)}`);
   assert.equal(await page.locator('.cv-search-row button').evaluate(el=>el.getBoundingClientRect().bottom<1000),true,`${lang} form below viewport ${width}`);
  }
  assert.equal(await page.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
  assert.equal(await page.locator('.cv-float').evaluate(el=>getComputedStyle(el).animationName),'none');
  assert.ok(!(await page.locator('main').innerText()).includes('verifyCertificate.studio.'));
  if(lang==='ar')await page.screenshot({path:'/tmp/certificate-arabic.png',fullPage:true});
  console.log('PASS locale/layout',lang);
 }
 await page.evaluate(()=>localStorage.setItem('i18nextLng','en'));await load();await page.setViewportSize({width:1440,height:1000});
 const search=async(value,expected)=>{
  await page.locator('#certificate-serial').fill(value);await page.locator('.cv-search-row button').click();
  await page.locator(`[data-status="${expected}"]`).waitFor();
 };
 delay=500;let before=calls;
 await page.locator('#certificate-serial').fill('  utaab-test-2026  ');
 await page.locator('.cv-search-row button').evaluate(el=>{el.click();el.click()});
 await page.locator('[data-status="loading"]').waitFor();assert.equal(await page.locator('.cv-search-row button').isDisabled(),true);
 await page.locator('[data-status="valid"]').waitFor();assert.equal(calls,before+1);
 assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('cv-result-region')),true);
 assert.equal(await page.locator('.cv-record-actions a').count(),2);
 assert.ok((await page.locator('.cv-record').innerText()).includes('Base Sepolia'));
 await page.screenshot({path:'/tmp/certificate-valid.png',fullPage:true});
 console.log('PASS loading, submit guard, result focus, PDF links, network label');
 for(const [next,expected] of [['revoked','revoked'],['missing','not_found'],['error','error'],['noPdf','valid'],['long','valid']]){
  mode=next;await search(next.toUpperCase(),expected);
  if(next==='noPdf'){assert.equal(await page.locator('.cv-record-actions a').count(),0);assert.equal(await page.locator('.cv-pdf-unavailable').isVisible(),true)}
  if(next==='revoked')assert.ok((await page.locator('.cv-record').innerText()).includes('Replaced by corrected certificate'));
  if(next==='long'){await page.setViewportSize({width:320,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.setViewportSize({width:1440,height:1000})}
  console.log('PASS result',next);
 }
 mode='valid';delay=100;
 await page.evaluate(()=>{history.pushState({},'', '/verify-certificate?serial=OLD');dispatchEvent(new PopStateEvent('popstate'))});
 await page.locator('[data-status="loading"]').waitFor();
 await page.evaluate(()=>{history.pushState({},'', '/verify-certificate?serial=NEW');dispatchEvent(new PopStateEvent('popstate'))});
 await page.locator('[data-status="valid"]').waitFor();await page.waitForTimeout(800);
 assert.ok(!(await page.locator('.cv-record').innerText()).includes('OLD RESULT'));
 await page.evaluate(()=>{history.pushState({},'', '/verify-certificate');dispatchEvent(new PopStateEvent('popstate'))});
 await page.waitForFunction(()=>!document.querySelector('[data-status]'));
 await load('/verify-certificate?serial=DEEP-LINK');await page.locator('[data-status="valid"]').waitFor();
 console.log('PASS stale response ignored, query reset, deep link verification');
 configured=true;await load();assert.equal(await page.locator('.cv-registry-notice').count(),0);
 for(const [next,expected] of [['valid','valid'],['revoked','revoked'],['missing','not_found'],['chainOnly','valid'],['error','error']]){mode=next;await search(next.toUpperCase(),expected);console.log('PASS configured chain',next)}
 assert.ok(chainCalls>0);
 configured=false;mode='valid';await load();
 await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(250);await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'/tmp/certificate-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});
 await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(250);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/certificate-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:'no-preference'});
 await page.locator('.cv-stage').scrollIntoViewIfNeeded();await page.mouse.move(5,5);
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.cv-float')).animationPlayState==='running');
 await page.waitForTimeout(1200);
 assert.equal(await page.locator('.cv-float').evaluate(el=>getComputedStyle(el).animationPlayState),'running');
 const stage=await page.locator('.cv-stage').boundingBox();await page.mouse.move(stage.x+stage.width*.75,stage.y+stage.height*.45);await page.waitForTimeout(500);
 assert.equal(await page.locator('.cv-float').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
 const tilt=await page.locator('.cv-certificate').getAttribute('style');
 await page.mouse.move(stage.x+stage.width*.25,stage.y+stage.height*.7);await page.waitForTimeout(500);
 assert.notEqual(await page.locator('.cv-certificate').getAttribute('style'),tilt);
 await page.mouse.move(5,5);await page.waitForTimeout(1000);
 assert.equal(await page.locator('.cv-float').evaluate(el=>getComputedStyle(el).animationPlayState),'running');
 const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});const events=[];cdp.on('Tracing.dataCollected',e=>events.push(...e.value));
 await cdp.send('Tracing.start',{categories:'devtools.timeline',transferMode:'ReportEvents'});await page.waitForTimeout(3000);
 const done=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');await done;
 console.log('Animation trace:',JSON.stringify({paints:events.filter(e=>e.name==='Paint').length,layouts:events.filter(e=>e.name==='Layout').length}));
 await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(200);assert.equal(await page.locator('.cv-float').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.cv-float').evaluate(el=>getComputedStyle(el).animationName),'none');
 console.log('PASS bounded pointer tilt, hover pause, offscreen suspension, live reduced motion');assert.deepEqual(errors,[]);console.log('PASS no runtime errors');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{await browser?.close()});
