document.querySelector('#year').textContent=new Date().getFullYear();
const nav=document.querySelector('#navigation'),menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)});
const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
dropdowns.forEach(d=>{d.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')d.open=true});d.addEventListener('pointerleave',()=>{if(!d.contains(document.activeElement))d.open=false});d.addEventListener('focusout',e=>{if(!d.contains(e.relatedTarget))d.open=false})});
document.addEventListener('click',e=>dropdowns.forEach(d=>{if(!d.contains(e.target))d.open=false}));
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{location.href=b.dataset.tool==='account'?'client.html':b.dataset.tool==='search'?'shop.html?tool=search':'checkout.html'}));
const dialog=document.querySelector('#dress-photo');



document.addEventListener('keydown',e=>{if(e.key==='Escape')dropdowns.forEach(d=>d.open=false)});
