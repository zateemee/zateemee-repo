import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {store,catalog} from './atelier-api.mjs';
import {notificationQueue} from './community-moderation.mjs';
store.exec(`CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,token TEXT NOT NULL,payload TEXT NOT NULL,amount INTEGER NOT NULL,currency TEXT NOT NULL,status TEXT NOT NULL,session TEXT,created TEXT NOT NULL);CREATE TABLE IF NOT EXISTS payment_events(id TEXT PRIMARY KEY);`);
const notifications=notificationQueue(store);
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
const ready=()=>!!(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_WEBHOOK_SECRET&&process.env.PUBLIC_SITE_URL?.startsWith('https://')&&process.env.PAYMENT_CURRENCY==='usd'&&process.env.STRIPE_SHIPPING_RATE&&process.env.SHIPPING_COUNTRIES&&process.env.PAYMENT_TAX_MODE==='automatic');
async function raw(req){let data='';for await(const chunk of req){data+=chunk;if(data.length>100000)fail('Request too large',413)}return data}
export async function paymentApi(req,res){
 if(!req.url.startsWith('/api/payments/'))return false;
 const send=(data,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data))};
 try{const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/payments/config'&&req.method==='GET'){send({enabled:ready(),currency:process.env.PAYMENT_CURRENCY||null});return true}
 if(url.pathname==='/api/payments/webhook'&&req.method==='POST'){
  if(!process.env.STRIPE_WEBHOOK_SECRET)fail('Payments are not configured',503);
  const payload=await raw(req),signature=req.headers['stripe-signature']||'';
  const timestamp=/t=(\d+)/.exec(signature)?.[1];
  if(!timestamp||Math.abs(Date.now()/1000-Number(timestamp))>300)fail('Invalid payment signature',400);
  const expected=createHmac('sha256',process.env.STRIPE_WEBHOOK_SECRET).update(timestamp+'.'+payload).digest();
  if(![...signature.matchAll(/v1=([a-f0-9]{64})/g)].some(m=>timingSafeEqual(Buffer.from(m[1],'hex'),expected)))fail('Invalid payment signature',400);
  const event=JSON.parse(payload);
  if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)){
   const session=event.data.object,order=store.prepare('SELECT * FROM orders WHERE id=?').get(session.client_reference_id);
   if(order&&order.session===session.id&&session.payment_status==='paid'&&session.currency===order.currency&&session.amount_subtotal===order.amount){
    store.exec('BEGIN IMMEDIATE');try{
     const inserted=store.prepare('INSERT OR IGNORE INTO payment_events VALUES(?)').run(event.id);
     if(inserted.changes&&order.status==='awaiting_payment'){
      store.prepare("UPDATE orders SET status='paid',session=? WHERE id=?").run(session.id,order.id);
      notifications.enqueue('paid-'+order.id,'Zateemee order paid '+order.id,'Payment confirmed. Order '+order.id+'\n'+order.payload);if(session.customer_details?.email)notifications.enqueue('customer-paid-'+order.id,'Your Zateemee payment confirmation '+order.id,'Payment confirmed. Order '+order.id+'. You can check your order status here: '+process.env.PUBLIC_SITE_URL+'/checkout.html?order='+order.id+'&token='+order.token,session.customer_details.email);
     }store.exec('COMMIT');
    }catch(error){store.exec('ROLLBACK');throw error}
   }
  }send({received:true});return true;
 }
 if(url.pathname==='/api/payments/order'&&req.method==='GET'){
  const order=store.prepare('SELECT id,status,token FROM orders WHERE id=?').get(url.searchParams.get('id'));const token=url.searchParams.get('token')||'';
  if(!order||token.length!==order.token.length||!timingSafeEqual(Buffer.from(token),Buffer.from(order.token)))fail('Order not found',404);
  send({reference:order.id,status:order.status});return true;
 }
 if(url.pathname==='/api/payments/checkout'&&req.method==='POST'){
  if(!req.headers.origin||new URL(req.headers.origin).host!==req.headers.host)fail('Request origin rejected',403);
  if(!ready())fail('Online payment is not available yet. Please enquire with the atelier.',503);
  const data=JSON.parse(await raw(req));if(!Array.isArray(data.items)||!data.items.length||data.items.length>10)fail('Choose occasion dresses');
  const products=catalog();let amount=0;
  const lines=data.items.map(item=>{const p=products.find(p=>p.id===item.id&&p.type==='occasion');
   if(!p||!p.available||!p.sizes?.includes(item.size)||!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>5)fail('Check dress availability, size and quantity');
   amount+=p.price*100*item.quantity;return {id:p.id,name:p.name,size:item.size,quantity:item.quantity,unitAmount:p.price*100};
  });
  const id='ZO-'+randomBytes(8).toString('hex').toUpperCase(),token=randomBytes(24).toString('hex');
  store.prepare('INSERT INTO orders VALUES(?,?,?,?,?,?,NULL,?)').run(id,token,JSON.stringify(lines),amount,'usd','awaiting_payment',new Date().toISOString());
  const base=process.env.PUBLIC_SITE_URL.replace(/\/$/,''),params=new URLSearchParams({mode:'payment',client_reference_id:id,success_url:base+'/checkout.html?order='+id+'&token='+token,cancel_url:base+'/checkout.html','automatic_tax[enabled]':'true','shipping_options[0][shipping_rate]':process.env.STRIPE_SHIPPING_RATE});
  process.env.SHIPPING_COUNTRIES.split(',').forEach((country,i)=>params.set(`shipping_address_collection[allowed_countries][${i}]`,country.trim()));
  lines.forEach((line,i)=>{const k=`line_items[${i}]`;params.set(k+'[quantity]',String(line.quantity));params.set(k+'[price_data][currency]','usd');params.set(k+'[price_data][unit_amount]',String(line.unitAmount));params.set(k+'[price_data][product_data][name]',line.name+' — '+line.size)});
  const response=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded','Idempotency-Key':id},body:params,signal:AbortSignal.timeout(15000)});
  const result=await response.json();if(!response.ok||!result.url)fail('Unable to start secure checkout. Please try again.',502);
  store.prepare('UPDATE orders SET session=? WHERE id=?').run(result.id,id);send({url:result.url,reference:id});return true;
 }
 fail('Endpoint not found',404);
 }catch(error){send({error:error.status?error.message:'Unable to process payment request.'},error.status||500)}return true;
}
