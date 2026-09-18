import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['checkout-options.js','atelier.js','dashboard.html','dashboard.js','moderation.html','moderation.js','wedding-dresses.html','asa.html','selena.html','janice.html','candace.html','anita.html','simi.html','esther.html','dress-gallery.js','photo-viewer.js','site-finish.js','client.html','client.css','client.js','measurement-schema.js','occasion-dress.html','checkout.html','occasion-products.js','occasion-commerce.js','blog.html','reviews.html','community.js','index.html','unforgettable.html','brand.html','our-story.html','awards.html','bridal.html','special-event.html','shop.html','lookbook.html','contact.html','styles.css','app.js','favicon.svg']) await copyFile(file,`dist/${file}`);
await cp('content','dist/content',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
console.log('Production site built in dist/');
