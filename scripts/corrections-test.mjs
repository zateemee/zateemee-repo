import fs from 'node:fs';import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/atelier/enquiries.js';
const html=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const names=['esther','asa','selena','janice','candace','anita','simi'];
for(const n of names){const links=[...html(n+'.html').matchAll(/href="([^"]+)"[^>]*>Enquire about/g)].map(m=>m[1]);assert.equal(links.length,2);assert.ok(links.every(link=>link===`contact.html?interest=bridal&amp;gown=${n}`));}
const descriptions=new Set();for(const f of fs.readdirSync(new URL('..',import.meta.url)).filter(f=>f.endsWith('.html'))){const page=html(f);const desc=page.match(/<meta name="description" content="([^"]+)"/)?.[1];if(desc){assert.ok(!descriptions.has(desc),`Duplicate description: ${f}`);descriptions.add(desc);}const footer=page.match(/<footer[\s\S]*?<\/footer>/)?.[0];if(footer){assert.ok(!footer.includes('>Reviews</a>'));assert.ok(footer.includes('href="wholesale.html"'));assert.ok(footer.includes('Zateemee Designs Ltd.'));}}
assert.ok(!html('awards.html').includes('Source notes'));assert.equal((html('awards.html').match(/target="_blank" rel="noopener noreferrer">/g)||[]).length,9);
assert.equal((html('our-story.html').match(/<img src="assets\/story-gallery\/story-0/g)||[]).length,3);
assert.ok(!html('our-story.html').includes('story-04.webp'));
assert.ok(html('our-story.html').includes('src="assets/hero.webp"'));
assert.ok(html('blog.html').includes('Zateemee Takes the New York Bridal Market!'));assert.ok(!html('blog.html').includes('NYBFW'));assert.ok(fs.existsSync(new URL('../assets/designer-gallery/designer-02-refined.webp',import.meta.url)));
const env={RESEND_API_KEY:'test-only',REVIEW_NOTIFY_EMAIL:'atelier@example.test',REVIEW_NOTIFY_FROM:'website@example.test',WHOLESALE_NOTIFY_EMAIL:'wholesale@example.test'};
const realFetch=globalThis.fetch;const sent=[];
const context=(data,settings=env)=>({env:settings,request:new Request('https://example.test/api/atelier/enquiries',{method:'POST',headers:{Origin:'https://example.test','Content-Type':'application/json'},body:JSON.stringify(data)})});
const base={name:'Test visitor',email:'visitor@example.test',message:'Isolated local test'};
try{
 globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');sent.push(JSON.parse(options.body));return Response.json({id:'mock-provider-acceptance'})};
 for(const interest of ['Bridal appointment','Special event','Retailer partnership','Couture Experience','Bespoke Couture','Zateemee Ambassador Program']){const response=await onRequestPost(context({...base,interest}));assert.equal(response.status,201);assert.equal(sent.at(-1).subject,'Zateemee enquiry — '+interest);assert.equal(sent.at(-1).to[0],env.REVIEW_NOTIFY_EMAIL);}
 const wholesale={...base,interest:'Wholesale',boutique:'Test Boutique',location:'Lagos, Nigeria',website:'https://example.test'};assert.equal((await onRequestPost(context(wholesale))).status,201);assert.equal(sent.at(-1).subject,'Wholesale enquiry — Test Boutique');assert.equal(sent.at(-1).to[0],env.WHOLESALE_NOTIFY_EMAIL);assert.ok(sent.at(-1).text.includes('Lagos, Nigeria'));
 assert.equal((await onRequestPost(context({...base,interest:'Bridal appointment'},{}))).status,503);
 assert.equal((await onRequestPost(context({...base,email:'invalid',interest:'Bridal appointment'}))).status,400);
 assert.equal((await onRequestPost(context({...base,interest:'Wholesale'}))).status,400);
 globalThis.fetch=async()=>new Response('provider failure',{status:503});assert.equal((await onRequestPost(context({...base,interest:'Bridal appointment'}))).status,502);
}finally{globalThis.fetch=realFetch}
console.log('PASS: seven gown links, unique metadata, clean footers, story gallery, blog, all seven enquiry options, wholesale routing, validation and provider failures. Email provider mocked; no email sent.');
