import {mkdir,copyFile,cp,readdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of await readdir('.')) if(/\.(?:html|js|css|svg)$/.test(file)) await copyFile(file,'dist/'+file);
await cp('content','dist/content',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
console.log('Production site built in dist/');
