// Confirm the atelier's contact details before enabling email delivery.
let bag=[];try{bag=JSON.parse(localStorage.getItem('zateemee-bag')||'[]');if(!Array.isArray(bag))bag=[]}catch{}
function saveBag(){try{localStorage.setItem('zateemee-bag',JSON.stringify(bag));window.dispatchEvent(new Event('zateemee:cart-change'))}catch{}}
const gowns = [
 {name:'Asa',image:'asa',category:'Satin',colour:'Ivory',alternative:'Pearl white',description:"Off-the-shoulder draped satin gown featuring a sculpted sweetheart neckline and softly structured bodice. Soft ruching defines the waist, accentuated with a delicate crystal and pearl embellishment flowing into a sleek fit-and-flare skirt with an elongated train. The silhouette is refined and modern, balancing clean minimalism with subtle couture detail. Button down detail at the back."},
 {name:'Simi',image:'simi',category:'Embellished',colour:'Ivory',alternative:'Not offered',description:"Corseted ballgown featuring a sculpted sweetheart neckline with a defined basque waist. The structured bodice is adorned with delicate appliqué and hand embellishment, complemented by embellished neck piece and shoulder straps that drape elegantly along the arms. The full skirt unfolds into a voluminous silhouette creating a timeless statement of regal romance and refined couture elegance."},
 {name:'Esther',image:'esther',category:'Lace',colour:'Pearl white',alternative:'Ivory',description:"Off-the-shoulder mermaid gown featuring an intricately embellished lace bodice with a sculpted sweetheart neckline and hand-placed lace long sleeves. Dimensional lace appliqué cascades over the corseted waist into a sleek satin skirt, contouring the silhouette before flowing into a refined train. A dramatic detachable drop-waist satin overskirt, with a statement drape and handmade flowers at the hip, adds regal volume and couture versatility, blending romance with modern structure."},
 {name:'Anita',image:'anita',category:'Lace',colour:'Pearl white',alternative:'Not offered',description:"heart shape Illusion high-neck ballgown featuring intricate lace appliqué with delicate hand embellishment throughout the bodice and long sheer sleeves. The sculpted corsetry defines the waist before flowing into a soft, voluminous tulle skirt layered with subtle shimmer and embroidered motifs. A cathedral-length veil completes the silhouette, embodying timeless romance with refined couture detail."},
 {name:'Janice',image:'janice',category:'Lace',colour:'Ivory',alternative:'Not offered',description:"Illusion high-neck mermaid gown featuring intricate lace appliqué over sculpted corsetry with a plunging sweetheart underlay. The fitted silhouette contours the body before flaring into a delicate lace train with scalloped edging. Sheer lace sleeves and an illusion back finished with covered buttons add refined structure, while a dramatic detachable satin bow and extended train create a statement of timeless couture romance."},
 {name:'Selena',image:'selena',category:'Satin',colour:'Pearl white',alternative:'Ivory',description:"Off-the-shoulder draped satin ballgown featuring a sculpted sweetheart neckline and softly structured bodice. Precision pleating defines the waist before transitioning into a subtle basque detail that enhances the silhouette. The voluminous skirt falls into fluid, luminous folds with discreet pockets and an extended train, embodying modern royalty with refined couture simplicity."},
 {name:'Candace',image:'candace',category:'Embellished',colour:'Ivory / silver',alternative:'Not offered',description:"High-neck halter gown fully hand-embellished with intricate crystal and sequin detailing throughout. The sculpted bodice contours seamlessly into a sleek column silhouette, elongating the frame with refined precision. It also has a detachable flowing train . A coordinating embellished cathedral-length veil adds soft drama and cohesive brilliance, creating a statement of modern couture elegance."}
];
const grid=document.querySelector('#gown-grid');
function renderGowns(filter='all'){
 const visible=gowns.filter(g=>filter==='all'||g.category===filter);
 grid.innerHTML=visible.map(g=>`<button class="gown-card" data-gown="${g.name}" aria-label="Explore ${g.name} gown"><div class="photo"><img src="assets/${g.image}.webp" alt="${g.name} bridal gown" loading="lazy"><span>Explore gown ↗</span></div><div class="card-heading"><h3>${g.name}</h3><span>↗</span></div><p>${g.category.toUpperCase()} · THE FOREVER COLLECTION</p></button>`).join('');
 document.querySelector('#filter-status').textContent=`${visible.length} gowns shown`;
 grid.querySelectorAll('[data-gown]').forEach(b=>b.addEventListener('click',()=>showGown(b.dataset.gown)));
}
renderGowns();
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderGowns(b.dataset.filter)}));
function showGown(name){
 const g=gowns.find(x=>x.name===name);
 document.querySelector('#gown-detail').innerHTML=`<div class="detail-layout"><img src="assets/${g.image}.webp" alt="${g.name} bridal gown"><div class="detail-copy"><p class="eyebrow">THE FOREVER COLLECTION</p><h2 id="gown-title">${g.name}</h2><p>${g.description}</p><dl><div><dt>Sample colour</dt><dd>${g.colour}</dd></div><div><dt>Alternative colour</dt><dd>${g.alternative}</dd></div><div><dt>Production</dt><dd>12 weeks</dd></div><div><dt>Rush production</dt><dd>8 weeks*</dd></div></dl><p class="price-note">Price on enquiry. *Rush availability and fees confirmed by the atelier.</p><a class="button burgundy" href="contact.html" id="gown-enquire">Enquire about ${g.name} ↗</a></div></div>`;
 const views=g.name==='Esther'?[['esther-front','Front'],['esther-rear','Back'],['esther','Full silhouette']]:g.name==='Janice'?[['janice','Front'],['janice-back','Back']]:[[g.image,'Front']];
 const mainPhoto=document.querySelector('#gown-detail .detail-layout>img');
 const photoPanel=document.createElement('div');photoPanel.className='detail-photos';mainPhoto.replaceWith(photoPanel);photoPanel.append(mainPhoto);
 mainPhoto.src=`assets/${views[0][0]}.webp`;mainPhoto.alt=`${g.name} gown — ${views[0][1].toLowerCase()} view`;
 if(views.length>1){const controls=document.createElement('div');controls.className='gown-photo-tabs';controls.setAttribute('role','group');controls.setAttribute('aria-label',`${g.name} photograph views`);views.forEach(([image,label],index)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed',String(index===0));button.addEventListener('click',()=>{mainPhoto.src=`assets/${image}.webp`;mainPhoto.alt=`${g.name} gown — ${label.toLowerCase()} view`;controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))});controls.append(button)});photoPanel.append(controls)}
 document.querySelector('#gown-dialog').showModal();
 document.querySelector('#gown-enquire').addEventListener('click',event=>{sessionStorage.setItem('zateemee-gown',g.name);sessionStorage.setItem('zt-enquiry-return',location.pathname+location.search+location.hash);event.currentTarget.href=`contact.html?interest=bespoke&gown=${encodeURIComponent(g.name)}&return=${encodeURIComponent(location.pathname+location.search+location.hash)}`;document.querySelector('#gown-dialog').close();document.querySelector('[name=message]').value=`I’m interested in the ${g.name} gown from The Forever Collection.\nOccasion date: `;document.querySelector('[name=interest]').value='Bridal appointment'});
}
document.querySelectorAll('dialog:not(#image-dialog)').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
document.querySelectorAll('[data-enquiry]').forEach(a=>a.addEventListener('click',()=>{sessionStorage.setItem('zateemee-interest',a.dataset.enquiry);document.querySelector('[name=interest]').value=a.dataset.enquiry}));

document.querySelector('#view-gallery').addEventListener('click',async()=>{const dialog=document.querySelector('#gallery-dialog');const container=document.querySelector('#full-gallery');dialog.showModal();try{const response=await fetch('assets/gallery.json');if(!response.ok)throw new Error();const names=await response.json();container.innerHTML=names.map((n,i)=>`<img src="assets/${n}.webp" alt="Forever Collection editorial photograph ${i+1}" loading="lazy">`).join('')}catch{container.textContent='The lookbook could not load. Please close it and try again.'}});
document.querySelector('#copy-enquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#prepared-message').value);document.querySelector('#copy-status').textContent='Copied. Share your enquiry with the atelier.'}catch{document.querySelector('#prepared-message').select();document.querySelector('#copy-status').textContent='Select and copy the prepared text to share your enquiry.'}});
document.querySelector('#year').textContent=new Date().getFullYear();

const selectedGown=sessionStorage.getItem('zateemee-gown');
const gownFromLink=new URLSearchParams(location.search).get('gown');
const selectedInterest=sessionStorage.getItem('zateemee-interest');
if(location.pathname.endsWith('contact.html')&&selectedInterest){document.querySelector('[name=interest]').value=selectedInterest;sessionStorage.removeItem('zateemee-interest')}
if(location.pathname.endsWith('contact.html')&&(gownFromLink||selectedGown)){const gown=(gownFromLink||selectedGown).slice(0,80);document.querySelector('[name=message]').value=`I’m interested in the ${gown} gown from The Forever Collection.\nOccasion date: `;sessionStorage.removeItem('zateemee-gown')}
const film=document.querySelector('#hero-video');
if(film){
 const hero=film.closest('.video-hero');
 const revealFilm=()=>hero.classList.add('is-video-playing');
 film.addEventListener('playing',revealFilm);
 film.addEventListener('timeupdate',()=>{if(film.currentTime>0)revealFilm()},{once:true});
 if(!film.paused&&film.readyState>=2)revealFilm();
 if(document.querySelector('#home').hidden){film.pause();film.removeAttribute('autoplay');film.querySelector('source').removeAttribute('src');film.load()}
 else {
  film.muted=true;film.defaultMuted=true;film.playsInline=true;
  const startFilm=()=>{if(document.visibilityState==='visible'&&film.paused)film.play().catch(()=>{})};
  startFilm();
  film.addEventListener('canplay',startFilm);
  window.addEventListener('pageshow',startFilm);
  document.addEventListener('visibilitychange',startFilm);
 }
}
if(document.body.classList.contains('page-index')){
 const homeLogo=document.querySelector('header .brand-logo');
 homeLogo?.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 });
}

const enquiryType=new URLSearchParams(location.search).get('interest');
const enquiryTypes={bespoke:'Bespoke Couture',couture:'Couture Experience',wholesale:'Wholesale',ambassador:'Zateemee Ambassador Program'};
if(location.pathname.endsWith('contact.html')&&enquiryTypes[enquiryType]){
 const interest=enquiryTypes[enquiryType];document.querySelector('[name=interest]').value=interest;
 document.querySelector('#contact h2').innerHTML=enquiryType==='bespoke'?'Bespoke <em>Couture.</em>':enquiryType==='couture'?'Your <em>Couture Experience.</em>':enquiryType==='wholesale'?'Wholesale <em>enquiries.</em>':'Zateemee <em>Ambassador Program.</em>';
 document.querySelector('#contact>div>p:not(.eyebrow)').textContent=(enquiryType==='couture'||enquiryType==='bespoke')?'Tell the atelier about your vision, occasion and preferred silhouette.':enquiryType==='wholesale'?'Share your boutique details and your interest in stocking the Zateemee collection.':'Share your interest in the Zateemee Ambassador Program and tell us about yourself.';
}

const cartCatalog=window.zateemeeOccasions||[];
function renderBag(){const container=document.querySelector('#bag-items');container.replaceChildren();const selected=cartCatalog.filter(g=>bag.includes(g.name));if(!selected.length)container.textContent='Your bag is empty. Explore a gown and add it to your selection.';selected.forEach(g=>{const row=document.createElement('div');row.className='bag-row';row.innerHTML=`<img src="assets/${g.image}.webp" alt="${g.name} gown"><span>${g.name}</span>`;const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label',`Remove ${g.name} from bag`);remove.addEventListener('click',()=>{bag=bag.filter(n=>n!==g.name);saveBag();renderBag()});row.append(remove);container.append(row)});document.querySelector('#bag-enquire').hidden=!selected.length;let checkout=container.parentElement.querySelector('.cart-checkout');if(!checkout){checkout=document.createElement('a');checkout.className='button burgundy cart-checkout';checkout.href='checkout.html';checkout.textContent='Review cart & checkout';container.after(checkout)}checkout.hidden=!selected.length}
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>{const kind=b.dataset.tool;if(kind==='search')return;if(kind==='account'){location.assign('client.html?reauth=1');return}if(kind==='cart')renderBag();document.querySelector(`#${kind}-dialog`).showModal()}));
const searchPages=[['Blog','blog.html'],['Our Story','our-story.html'],['The Designer','brand.html#the-designer'],['Our Craft','brand.html#our-craft'],['Collections','index.html#home-collections'],['The Forever Collection','bridal.html'],['The Unforgettable Collection','unforgettable.html'],['Bespoke Couture','experience.html?interest=bespoke'],['The Couture Experience','experience.html'],['Special Occasions Dress','special-event.html'],['African Couture','african-couture.html'],['Shop','special-event.html'],['Ambassador Program','ambassador.html'],['Contact Us','contact.html']];
document.querySelector('#site-search').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();const output=document.querySelector('#search-results');output.replaceChildren();if(!q)return;const matches=[...gowns.filter(g=>`${g.name} ${g.category} ${g.description}`.toLowerCase().includes(q)).map(g=>[g.name+' — bridal gown',g.image+'.html']),...searchPages.filter(([label])=>label.toLowerCase().includes(q))];if(!matches.length)output.textContent='No matches found. Try a gown name or material.';matches.forEach(([label,url])=>{const a=document.createElement('a');a.textContent=label;a.href=url;output.append(a)})});
const requestedGown=new URLSearchParams(location.search).get('gown');if(gowns.some(g=>g.name===requestedGown))showGown(requestedGown);
document.querySelector('#bag-enquire').addEventListener('click',()=>{sessionStorage.setItem('zateemee-bag-enquiry',cartCatalog.filter(g=>bag.includes(g.name)).map(g=>g.name).join(', '))});
if(location.pathname.endsWith('contact.html')){const selection=sessionStorage.getItem('zateemee-bag-enquiry');if(selection){document.querySelector('[name=message]').value=`I would like to enquire about: ${selection}.\nOccasion date: `;sessionStorage.removeItem('zateemee-bag-enquiry')}}

const requestedTool=new URLSearchParams(location.search).get('tool');if(requestedTool==='cart'){renderBag();document.querySelector('#cart-dialog').showModal()};


(() => {
 const section=document.querySelector('.page-index .home-atelier');if(!section)return;
 const photo=section.querySelector(':scope > img'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches)return;
 photo.classList.add('couture-zoom-waiting');
 let playing=false;const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting){playing=false;photo.classList.remove('couture-zoom-settle');photo.classList.add('couture-zoom-waiting')}else if(entry.intersectionRatio>=.2&&!playing&&!reduced.matches){playing=true;photo.classList.remove('couture-zoom-waiting');photo.classList.add('couture-zoom-settle')}}},{threshold:[0,.2]});
 observer.observe(section);
 reduced.addEventListener('change',()=>{playing=false;if(reduced.matches){observer.disconnect();photo.classList.remove('couture-zoom-waiting','couture-zoom-settle')}else{photo.classList.add('couture-zoom-waiting');observer.observe(section)}});
})();
