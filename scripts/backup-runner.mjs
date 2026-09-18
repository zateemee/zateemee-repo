import {spawnSync} from 'node:child_process';
function backup(){const result=spawnSync(process.execPath,['scripts/backup.mjs'],{stdio:'inherit',env:process.env});if(result.status!==0)console.error('Database backup failed; investigate before relying on this snapshot.');}
backup();
setInterval(backup,24*60*60*1000);
