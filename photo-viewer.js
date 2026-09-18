(() => {
 const viewer=document.querySelector('#dress-photo')||document.querySelector('#image-dialog');
 if(!viewer)return;
 const image=viewer.querySelector('img');
 const close=viewer.querySelector('.close');
 viewer.classList.add('photo-viewer');
 let photos=[],position=0,trigger;
 const previous=document.createElement('button'),next=document.createElement('button');
 for(const [button,label,glyph,cls] of [[previous,'Previous photograph','‹','photo-previous'],[next,'Next photograph','›','photo-next']]){
  button.type='button';button.className='photo-control '+cls;button.setAttribute('aria-label',label);button.textContent=glyph;viewer.append(button);
 }
 function display(index){position=(index+photos.length)%photos.length;const item=photos[position];image.src=item.dataset.photo||item.dataset.image;image.alt=item.querySelector('img')?.alt||'Zateemee photograph';}
 const targets=[...document.querySelectorAll('[data-photo],[data-image]')];
 targets.forEach(item=>item.addEventListener('click',()=>{
  photos=targets.filter(p=>p.getClientRects().length&&!p.closest('[hidden]'));
  trigger=item;display(photos.indexOf(item));previous.hidden=next.hidden=photos.length<2;viewer.showModal();close.focus();
 }));
 previous.addEventListener('click',()=>display(position-1));next.addEventListener('click',()=>display(position+1));
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();display(position-1)}if(event.key==='ArrowRight'){event.preventDefault();display(position+1)}});
 close.addEventListener('click',()=>viewer.close());
 viewer.addEventListener('close',()=>trigger?.focus());
 viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close()});
})();
