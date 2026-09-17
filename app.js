// Confirm the atelier's contact details before enabling email delivery.
const CONTACT_EMAIL = '';
const gowns = [
 {name:'Asa',image:'asa',category:'Satin',colour:'Ivory',alternative:'Pearl white',description:'An off-the-shoulder draped satin gown with a sculpted sweetheart neckline and softly structured bodice. Waist-defining ruching, delicate crystal and pearl embellishment, and a sleek fit-and-flare skirt flow into an elongated train. Covered buttons finish the back.'},
 {name:'Simi',image:'simi',category:'Embellished',colour:'Ivory',alternative:'Not offered',description:'A corseted ballgown with a sculpted sweetheart neckline and defined basque waist. Delicate appliqué and hand embellishment adorn the structured bodice, complemented by an embellished neck piece and elegantly draped shoulder straps. A voluminous skirt completes this statement of regal romance.'},
 {name:'Esther',image:'esther',category:'Lace',colour:'Pearl white',alternative:'Ivory',description:'An off-the-shoulder mermaid gown with an intricately embellished lace bodice and hand-placed lace sleeves. Dimensional appliqué cascades over the corseted waist into a sleek satin skirt. A detachable drop-waist overskirt, statement drape and handmade flowers at the hip offer couture versatility.'},
 {name:'Anita',image:'anita',category:'Lace',colour:'Pearl white',alternative:'Not offered',description:'An illusion high-neck ballgown with intricate lace appliqué, hand embellishment and long sheer sleeves. Sculpted corsetry defines the waist above a voluminous tulle skirt layered with subtle shimmer and embroidered motifs. A cathedral-length veil completes the romantic silhouette.'},
 {name:'Janice',image:'janice',category:'Lace',colour:'Ivory',alternative:'Not offered',description:'An illusion high-neck mermaid gown with lace appliqué over sculpted corsetry and a plunging sweetheart underlay. Sheer lace sleeves, covered buttons and a scalloped lace train bring refined detail. A detachable satin bow and extended train add a dramatic finishing touch.'},
 {name:'Selena',image:'selena',category:'Satin',colour:'Pearl white',alternative:'Ivory',description:'An off-the-shoulder draped satin ballgown with a sculpted sweetheart neckline. Precision pleating defines the waist and a subtle basque detail enhances the silhouette. Fluid, luminous folds, discreet pockets and an extended train embody modern royalty.'},
 {name:'Candace',image:'candace',category:'Embellished',colour:'Ivory / silver',alternative:'Not offered',description:'A high-neck halter gown fully hand-embellished with crystal and sequin detailing. The sculpted bodice contours into a sleek column silhouette, with a detachable flowing train. A coordinating embellished cathedral-length veil adds soft drama.'}
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
 document.querySelector('#gown-dialog').showModal();
 document.querySelector('#gown-enquire').addEventListener('click',()=>{sessionStorage.setItem('zateemee-gown',g.name);document.querySelector('#gown-dialog').close();document.querySelector('[name=message]').value=`I’m interested in the ${g.name} gown from The Forever Collection.\nOccasion date: `;document.querySelector('[name=interest]').value='Bridal appointment'});
}
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
const toggle=document.querySelector('.menu-toggle');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.querySelector('nav').classList.toggle('open',open)});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open')}));
document.querySelectorAll('[data-enquiry]').forEach(a=>a.addEventListener('click',()=>{sessionStorage.setItem('zateemee-interest',a.dataset.enquiry);document.querySelector('[name=interest]').value=a.dataset.enquiry}));
document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#large-image').src=b.dataset.image;document.querySelector('#image-dialog').showModal()}));
document.querySelector('#view-gallery').addEventListener('click',async()=>{const dialog=document.querySelector('#gallery-dialog');const container=document.querySelector('#full-gallery');dialog.showModal();try{const response=await fetch('assets/gallery.json');if(!response.ok)throw new Error();const names=await response.json();container.innerHTML=names.map((n,i)=>`<img src="assets/${n}.webp" alt="Forever Collection editorial photograph ${i+1}" loading="lazy">`).join('')}catch{container.textContent='The lookbook could not load. Please close it and try again.'}});
document.querySelector('#enquiry-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.target);const message=`Zateemee enquiry — ${data.get('interest')}\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;document.querySelector('#prepared-message').value=message;document.querySelector('#enquiry-result').hidden=false;document.querySelector('#form-note').textContent=CONTACT_EMAIL?'Your email application will open. Send your message there to complete the enquiry.':'Your enquiry is prepared below. Copy it to share through your existing Zateemee contact. It has not been sent.';if(CONTACT_EMAIL)location.href=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Zateemee — '+data.get('interest'))}&body=${encodeURIComponent(message)}`;document.querySelector('#prepared-message').focus()});
document.querySelector('#copy-enquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.querySelector('#prepared-message').value);document.querySelector('#copy-status').textContent='Copied. Share your enquiry with the atelier.'}catch{document.querySelector('#prepared-message').select();document.querySelector('#copy-status').textContent='Select and copy the prepared text to share your enquiry.'}});
document.querySelector('#year').textContent=new Date().getFullYear();

const selectedGown=sessionStorage.getItem('zateemee-gown');
const selectedInterest=sessionStorage.getItem('zateemee-interest');
if(location.pathname.endsWith('contact.html')&&selectedInterest){document.querySelector('[name=interest]').value=selectedInterest;sessionStorage.removeItem('zateemee-interest')}
if(location.pathname.endsWith('contact.html')&&selectedGown){document.querySelector('[name=message]').value=`I’m interested in the ${selectedGown} gown from The Forever Collection.\nOccasion date: `;sessionStorage.removeItem('zateemee-gown')}
const film=document.querySelector('#hero-video');
if(film){if(document.querySelector('#home').hidden){film.pause();film.removeAttribute('autoplay');film.querySelector('source').removeAttribute('src');film.load()}else if(matchMedia('(prefers-reduced-motion: reduce)').matches){film.autoplay=false;film.pause()}else{film.play().catch(()=>{})}}

const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
dropdowns.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)dropdowns.forEach(other=>{if(other!==d)other.open=false})}));
document.addEventListener('click',e=>{dropdowns.forEach(d=>{if(!d.contains(e.target))d.open=false})});
document.addEventListener('keydown',e=>{if(e.key==='Escape')dropdowns.forEach(d=>{if(d.open){d.open=false;d.querySelector('summary').focus()}})});
document.querySelectorAll('.dropdown-panel a').forEach(a=>a.addEventListener('click',()=>dropdowns.forEach(d=>d.open=false)));
const enquiryType=new URLSearchParams(location.search).get('interest');
const enquiryTypes={couture:'Couture Experience',wholesale:'Wholesale',ambassador:'Xatini Ambassador Program'};
if(location.pathname.endsWith('contact.html')&&enquiryTypes[enquiryType]){
 const interest=enquiryTypes[enquiryType];document.querySelector('[name=interest]').value=interest;
 document.querySelector('#contact h2').innerHTML=enquiryType==='couture'?'Your <em>Couture Experience.</em>':enquiryType==='wholesale'?'Wholesale <em>enquiries.</em>':'Xatini <em>Ambassador Program.</em>';
 document.querySelector('#contact>div>p:not(.eyebrow)').textContent=enquiryType==='couture'?'Tell the atelier about your vision, occasion and preferred silhouette.':enquiryType==='wholesale'?'Share your boutique details and your interest in stocking the Zateemee collection.':'Share your interest in the Xatini Ambassador Program and tell us about yourself.';
}
