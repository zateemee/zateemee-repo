(() => {
 const viewer=document.querySelector('#dress-photo')||document.querySelector('#image-dialog');
 if(!viewer)return;
 const image=viewer.querySelector('img');
 const close=viewer.querySelector('.close');
 viewer.classList.add('photo-viewer');
 let photos=[],position=0,trigger,changing=false,closing=false;
 const reduced=matchMedia("(prefers-reduced-motion: reduce)");
 const previous=document.createElement('button'),next=document.createElement('button');
 for(const [button,label,glyph,cls] of [[previous,'Previous photograph','‹','photo-previous'],[next,'Next photograph','›','photo-next']]){
  button.type='button';button.className='photo-control '+cls;button.setAttribute('aria-label',label);button.textContent=glyph;viewer.append(button);
 }
 function display(index){position=(index+photos.length)%photos.length;const item=photos[position];image.src=item.dataset.photo||item.dataset.image;image.alt=item.querySelector('img')?.alt||'Zateemee photograph';}
 async function change(direction){
  if(changing||closing||photos.length<2)return;
  changing=true;
  const index=(position+direction+photos.length)%photos.length;
  const preload=new Image();preload.src=photos[index].dataset.photo||photos[index].dataset.image;
  try{await preload.decode()}catch{changing=false;return}
  if(closing||!viewer.open){changing=false;return}
  const duration=reduced.matches?0:160;
  await image.animate([{opacity:1},{opacity:0}],{duration,fill:'forwards',easing:'ease-in'}).finished;
  if(closing||!viewer.open){changing=false;return}
  display(index);
  await image.animate([{opacity:0},{opacity:1}],{duration:reduced.matches?0:220,fill:'forwards',easing:'ease-out'}).finished;
  changing=false;
 }
 async function dismiss(){
  if(closing||!viewer.open)return;
  closing=true;viewer.classList.add('viewer-closing');
  await viewer.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.98)'}],{duration:reduced.matches?0:220,easing:'ease-in',fill:'forwards'}).finished;
  viewer.close();viewer.classList.remove('viewer-closing');
 }

 const targets=[...document.querySelectorAll('[data-photo],[data-image]')];
 targets.forEach(item=>item.addEventListener('click',()=>{
  photos=targets.filter(p=>p.getClientRects().length&&!p.closest('[hidden]'));
  closing=false;changing=false;viewer.getAnimations().forEach(a=>a.cancel());image.getAnimations().forEach(a=>a.cancel());trigger=item;display(photos.indexOf(item));previous.hidden=next.hidden=photos.length<2;viewer.showModal();viewer.animate([{opacity:0,transform:"scale(.98)"},{opacity:1,transform:"scale(1)"}],{duration:reduced.matches?0:240,easing:"ease-out"});close.focus();
 }));
 previous.addEventListener('click',()=>change(-1));next.addEventListener('click',()=>change(1));
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();change(-1)}if(event.key==='ArrowRight'){event.preventDefault();change(1)}});
 close.addEventListener('click',()=>dismiss());
 viewer.addEventListener('cancel',event=>{event.preventDefault();dismiss()});
 viewer.addEventListener('close',()=>trigger?.focus());
 viewer.addEventListener('click',event=>{if(event.target===viewer)dismiss()});
})();
