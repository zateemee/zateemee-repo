import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
const db=new DatabaseSync(path.resolve(process.env.DATA_DIR||'data','community.sqlite'));
const [table,action,id]=process.argv.slice(2);if(!['reviews','comments'].includes(table)||!['list','publish','reject'].includes(action)){console.log('Usage: node scripts/moderate-community.mjs reviews|comments list|publish|reject [id]');process.exit(1)}
if(action==='list')console.log(db.prepare(`SELECT * FROM ${table} WHERE status='pending'`).all());else{if(!id)throw new Error('An entry ID is required');console.log(db.prepare(`UPDATE ${table} SET status=? WHERE id=?`).run(action==='publish'?'published':'rejected',id))}
