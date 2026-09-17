import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['wedding-dresses.html','asa.html','selena.html','janice.html','candace.html','anita.html','simi.html','dress-gallery.js','client.html','client.css','client.js','measurement-schema.js','index.html','unforgettable.html','brand.html','our-story.html','awards.html','bridal.html','special-event.html','shop.html','lookbook.html','contact.html','styles.css','app.js','favicon.svg']) await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('Production site built in dist/');
