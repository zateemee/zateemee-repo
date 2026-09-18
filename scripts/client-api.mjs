import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {randomBytes,createHash,scryptSync,timingSafeEqual} from 'node:crypto';
const dir=path.resolve(process.env.DATA_DIR||'data');mkdirSync(dir,{recursive:true});
const db=new DatabaseSync(path.join(dir,'clients.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS favourites(user_id TEXT PRIMARY KEY REFERENCES users(id),payload TEXT NOT NULL);CREATE TABLE IF NOT EXISTS measurements(user_id TEXT PRIMARY KEY REFERENCES users(id),payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS appointments(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS production(user_id TEXT PRIMARY KEY REFERENCES users(id),payload TEXT NOT NULL);`);
const digest=x=>createHash('sha256').update(x).digest('hex');
const attempts=new Map();
function fail(message,status=400){throw Object.assign(new Error(message),{status})}
async function body(req){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>40000)fail('Request too large',413)}try{return JSON.parse(raw)}catch{fail('Invalid request')}}
function session(req){const token=/zt_session=([a-f0-9]+)/.exec(req.headers.cookie||'')?.[1];return token?db.prepare('SELECT users.id,users.name,users.email FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=? AND expires>?').get(digest(token),Date.now()):null}
export async function clientApi(req,res){
 if(!req.url.startsWith('/api/client/'))return false;
 const send=(value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value))};
 try{
 const route=new URL(req.url,'http://localhost').pathname;
 if(req.method!=='GET'){const origin=req.headers.origin;if(origin&&new URL(origin).host!==req.headers.host)fail('Request origin rejected',403)}
 if(route==='/api/client/register'||route==='/api/client/login'){
 if(req.method!=='POST')fail('Method not allowed',405);
 const key=req.socket.remoteAddress;const limit=attempts.get(key)||{count:0,until:Date.now()+900000};if(limit.until<Date.now()){limit.count=0;limit.until=Date.now()+900000}attempts.set(key,limit);if(++limit.count>20)fail('Too many attempts. Try again in 15 minutes.',429);
 const data=await body(req);const email=String(data.email||'').trim().toLowerCase();const password=String(data.password||'');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||password.length<12||password.length>128)fail('Enter a valid email and a password of 12–128 characters.');
 let user;
 if(route.endsWith('register')){const name=String(data.name||'').trim();if(!name||name.length>100)fail('Enter your name.');const salt=randomBytes(16).toString('hex');try{db.prepare('INSERT INTO users VALUES(?,?,?,?)').run(randomBytes(16).toString('hex'),name,email,salt+':'+scryptSync(password,salt,64).toString('hex'))}catch{fail('Unable to create this account. Try signing in.',409)}}
 user=db.prepare('SELECT * FROM users WHERE email=?').get(email);
 const [salt,hash]=(user?.password||'0000000000000000:'+ '00'.repeat(64)).split(':');if(!timingSafeEqual(scryptSync(password,salt,64),Buffer.from(hash,'hex'))||!user)fail('Email or password is incorrect.',401);
 const token=randomBytes(32).toString('hex');db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token),user.id,Date.now()+604800000);
 res.setHeader('Set-Cookie',`zt_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${process.env.NODE_ENV==='production'?'; Secure':''}`);send({name:user.name,email:user.email});return true;
 }
 const user=session(req);if(!user)fail('Please sign in to your client space.',401);
 if(route.endsWith('/favourites')&&req.method==='GET'){send(JSON.parse(db.prepare('SELECT payload FROM favourites WHERE user_id=?').get(user.id)?.payload||'[]'));return true}
if(route.endsWith('/favourites')&&req.method==='PUT'){if(!req.headers.origin||new URL(req.headers.origin).host!==req.headers.host)fail('Request origin rejected',403);const data=await body(req);if(!Array.isArray(data)||data.length>30||data.some(id=>typeof id!=='string'||!/^[a-z0-9-]{1,80}$/.test(id)))fail('Invalid shortlist');db.prepare('INSERT INTO favourites VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET payload=excluded.payload').run(user.id,JSON.stringify([...new Set(data)]));send({saved:true});return true}
if(route.endsWith('/logout')&&req.method==='POST'){const token=/zt_session=([a-f0-9]+)/.exec(req.headers.cookie||'')?.[1];db.prepare('DELETE FROM sessions WHERE token=?').run(digest(token));res.setHeader('Set-Cookie','zt_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');send({ok:true})}
 else if(route.endsWith('/me')&&req.method==='GET'){send({name:user.name,email:user.email,measurements:JSON.parse(db.prepare('SELECT payload FROM measurements WHERE user_id=?').get(user.id)?.payload||'{}'),appointments:db.prepare('SELECT id,payload FROM appointments WHERE user_id=?').all(user.id).map(x=>({id:x.id,...JSON.parse(x.payload)})),production:JSON.parse(db.prepare('SELECT payload FROM production WHERE user_id=?').get(user.id)?.payload||'null')})}
 else if(route.endsWith('/measurements')&&req.method==='PUT'){const data=await body(req);if(!['cm','inches'].includes(data.unit))fail('Choose a measurement unit.');const values={};for(let i=1;i<=64;i++){const val=String(data.values?.[i]||'').trim();if(val.length>40)fail('Measurement is too long.');values[i]=val}const payload={unit:data.unit,values,garment:String(data.garment||'').slice(0,150),notes:String(data.notes||'').slice(0,2000),updatedAt:new Date().toISOString()};db.prepare('INSERT INTO measurements VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET payload=excluded.payload').run(user.id,JSON.stringify(payload));send({ok:true})}
 else if(route.endsWith('/appointments')&&req.method==='POST'){const data=await body(req);if(!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||data.date<new Date().toISOString().slice(0,10)||!['09:00','10:00','11:00','12:00','13:00','14:00','15:00'].includes(data.time)||!['Bridal consultation','Bespoke couture','Fitting'].includes(data.type))fail('Choose a valid future date, time and appointment type.');const count=db.prepare('SELECT COUNT(*) AS n FROM appointments WHERE user_id=?').get(user.id).n;if(count>=30)fail('Please contact the atelier to manage your existing requests.');db.prepare('INSERT INTO appointments VALUES(?,?,?)').run(randomBytes(16).toString('hex'),user.id,JSON.stringify({date:data.date,time:data.time,type:data.type,notes:String(data.notes||'').slice(0,2000),status:'Requested',createdAt:new Date().toISOString()}));send({ok:true},201)}
 else fail('Endpoint not found',404);
 }catch(error){send({error:error.status?error.message:'Something went wrong. Please try again.'},error.status||500)}return true;
}
