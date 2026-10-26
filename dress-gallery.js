document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.tool==='search')return;location.href=b.dataset.tool==='account'?'client.html':b.dataset.tool==='search'?'shop.html?tool=search':'checkout.html'}));
const dialog=document.querySelector('#dress-photo');



document.addEventListener('click',e=>{const link=e.target.closest('a[href*="occasion-dress.html"]');if(!link||e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;e.preventDefault();document.querySelector('main')?.classList.add('occasion-leaving');setTimeout(()=>location.assign(link.href),400)});
window.addEventListener('pageshow',()=>document.querySelector('main')?.classList.remove('occasion-leaving'));
