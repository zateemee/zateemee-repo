import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','brand.html','bridal.html','special-event.html','shop.html','lookbook.html','contact.html','styles.css','app.js','favicon.svg']) await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('Production site built in dist/');
