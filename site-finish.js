(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const siteHeader=document.querySelector('body:not(.client-body)>header');
 if(siteHeader){const updateHeader=()=>siteHeader.classList.toggle('is-scrolled',window.scrollY>24);updateHeader();addEventListener('scroll',updateHeader,{passive:true})}
 const pictures=document.querySelectorAll('.house-story .story-photo,.designer-rack-photo,.asa-photos button,.forever-photo-grid button,.occasion-photo,.home-editorials .story-photo');
 if(!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('photo-arrived');observer.unobserve(entry.target)}}),{threshold:.08});pictures.forEach(photo=>{photo.classList.add('photo-reveal');observer.observe(photo)});reduced.addEventListener('change',()=>{if(reduced.matches){observer.disconnect();pictures.forEach(photo=>photo.classList.add('photo-arrived'))}})}
 const nav=document.querySelector('#navigation'),sourceMenu=document.querySelector('.menu-toggle');if(!nav||!sourceMenu)return;
 const experienceLink=[...nav.querySelectorAll('a')].find(link=>link.textContent.trim()==='The Couture Experience');
 if(experienceLink)experienceLink.href='experience.html';
 /* Replace page-specific menu listeners with one predictable drawer controller. */
 const menu=sourceMenu.cloneNode(true);sourceMenu.replaceWith(menu);
 const logo=document.createElement('a');logo.className='mobile-menu-brand';logo.href='index.html';logo.setAttribute('aria-label','Zateemee home');logo.innerHTML='<img src="assets/zateemee-logo.png" alt="Zateemee Bride" width="200" height="87">';
 const closeMenu=document.createElement('button');closeMenu.className='mobile-menu-close';closeMenu.type='button';closeMenu.setAttribute('aria-label','Close menu');closeMenu.textContent='×';nav.prepend(logo,closeMenu);
 const media=matchMedia('(max-width: 760px)');
 function setMenu(open,restoreFocus=false){const active=Boolean(open&&media.matches);menu.setAttribute('aria-expanded',String(active));nav.classList.toggle('open',active);document.body.classList.toggle('mobile-menu-open',active);if(!active){nav.querySelectorAll('details[open]').forEach(item=>item.open=false);if(restoreFocus)menu.focus()}}
 menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
 closeMenu.addEventListener('click',()=>setMenu(false,true));
 media.addEventListener('change',()=>setMenu(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')setMenu(false,true)});
 document.addEventListener('click',e=>{if(menu.getAttribute('aria-expanded')==='true'&&!nav.contains(e.target)&&!menu.contains(e.target))setMenu(false)});
 /* Use deterministic mobile controls instead of combining focus and the native
    details/link defaults. This avoids iOS Safari cancelling a tap while the
    drawer is changing visibility. */
 nav.querySelectorAll('.nav-dropdown>summary').forEach(summary=>summary.addEventListener('click',event=>{
  if(!media.matches)return;
  event.preventDefault();
  event.stopPropagation();
  const item=summary.parentElement,open=!item.open;
  nav.querySelectorAll('.nav-dropdown[open]').forEach(other=>{if(other!==item)other.open=false});
 item.open=open;
 }));
 nav.querySelectorAll('.nav-dropdown').forEach(item=>{
  item.addEventListener('pointerenter',event=>{if(!media.matches&&event.pointerType==='mouse')item.open=true});
  item.addEventListener('pointerleave',event=>{if(!media.matches&&event.pointerType==='mouse'&&!item.contains(document.activeElement))item.open=false});
  item.addEventListener('focusin',()=>{if(!media.matches)item.open=true});
  item.addEventListener('focusout',event=>{if(!media.matches&&!item.contains(event.relatedTarget))item.open=false});
 });
 nav.addEventListener('click',event=>{
  const link=event.target.closest('a');
  if(!link||!media.matches||link.classList.contains('mobile-menu-brand'))return;
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  event.stopPropagation();
  const destination=link.href;
  setMenu(false);
  location.assign(destination);
 },true);
 nav.querySelectorAll('.nav-dropdown').forEach(collections=>{const panel=collections.querySelector('.dropdown-panel');const line=document.createElement('span');line.className='collection-nav-line';panel.append(line);function position(link){line.style.top=link.offsetTop+link.offsetHeight-5+'px';line.style.width=Math.max(0,link.offsetWidth-40)+'px';line.style.opacity='1'};panel.querySelectorAll('a').forEach(link=>{link.addEventListener('pointerenter',()=>position(link));link.addEventListener('focus',()=>position(link))});panel.addEventListener('pointerleave',()=>line.style.opacity='0')});
})();

/* A quiet editorial overlap, following native scroll with a small eased drift. */
(()=>{
 const feature=document.querySelector('.page-index .home-portrait-feature');
 const panel=document.querySelector('.page-index .home-editorial-selection');
 const portrait=feature?.querySelector('.home-portrait-layout');
 if(!feature||!panel||!portrait)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,lastTime=0,current=0,target=0,visible=true;
 const clamp=value=>Math.max(0,Math.min(1,value));
 function measure(){
  const entering=innerHeight-(feature.getBoundingClientRect().top+portrait.offsetHeight);
  const progress=clamp(entering/Math.max(1,innerHeight*.85));
  const eased=progress*progress*(3-2*progress);
  target=reduced.matches?0:(1-eased)*(innerWidth<=760?14:22);
 }
 function paint(){panel.style.setProperty('--editorial-drift',current.toFixed(3)+'px')}
 function tick(time){
  frame=0;
  const delta=lastTime?Math.min(48,time-lastTime):16.67;lastTime=time;
  current+=(target-current)*(1-Math.exp(-delta/105));
  if(Math.abs(target-current)<.025)current=target;
  paint();
  if(current!==target&&visible&&!reduced.matches)frame=requestAnimationFrame(tick);else lastTime=0;
 }
 function update(){measure();if(!visible||reduced.matches){cancelAnimationFrame(frame);frame=0;lastTime=0;current=target;paint();return}if(!frame)frame=requestAnimationFrame(tick)}
 measure();current=target;paint();
 addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});
 reduced.addEventListener('change',update);
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;update()});
 new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting)&&!document.hidden;update()},{rootMargin:'160px'}).observe(feature);
})();

/* Mobile collection: one full-size gown at a time, advancing every two seconds. */
(()=>{
 const track=document.querySelector('.page-index .home-selection-grid');
 if(!track)return;
 const mobile=matchMedia('(max-width: 760px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const originals=[...track.querySelectorAll('.home-selection-card')];
 if(originals.length<3)return;
 track.setAttribute('aria-label','Featured bridal gowns');
 track.setAttribute('aria-roledescription','carousel');
 track.setAttribute('aria-live','off');
 originals.slice(0,2).forEach(card=>{const copy=card.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.tabIndex=-1;track.append(copy)});
 const cards=[...track.querySelectorAll('.home-selection-card')];
 let index=0,timer=null,resumeTimer=null,visible=false;
 const leftFor=i=>cards[i].offsetLeft-cards[0].offsetLeft;
 const stop=()=>{clearInterval(timer);timer=null};
 const start=()=>{stop();if(!mobile.matches||reduced.matches||!visible||document.hidden)return;timer=setInterval(()=>{index++;track.scrollTo({left:leftFor(index),behavior:'smooth'});if(index===originals.length)setTimeout(()=>{track.style.scrollSnapType='none';track.scrollLeft=0;index=0;requestAnimationFrame(()=>track.style.scrollSnapType='')},650)},2000)};
 const pause=()=>{stop();clearTimeout(resumeTimer)};
 track.addEventListener('touchstart',pause,{passive:true});
 track.addEventListener('touchend',()=>{resumeTimer=setTimeout(()=>{const step=leftFor(1);index=Math.min(originals.length-1,Math.max(0,Math.round(track.scrollLeft/step)));start()},4000)},{passive:true});
 track.addEventListener('focusin',pause);
 track.addEventListener('focusout',()=>{resumeTimer=setTimeout(start,2000)});
 document.addEventListener('visibilitychange',start);
 mobile.addEventListener('change',()=>{if(!mobile.matches){pause();track.scrollLeft=0}else start()});
 reduced.addEventListener('change',start);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()},{threshold:.3}).observe(track);
})();

queueMicrotask(() => {
 const coutureLink=document.querySelector('.home-atelier-card .home-link');
 if(coutureLink)coutureLink.href='experience.html';
 const opening=document.querySelector('.page-bridal .collection-opening');
 if(opening){const note=document.createElement('div');note.className='collection-editorial-note';note.innerHTML='<p class="eyebrow">THE FOREVER COLLECTION</p><p>Each silhouette begins with a point of view. Explore the photographs, then step inside each gown’s story.</p><a href="wedding-dresses.html">Discover the gowns ↗</a>';opening.after(note)}
 const hub=document.querySelector('.page-contact .contact-hub');
 if(hub){const journey=document.createElement('a');journey.className='contact-journey-link';journey.href='experience.html';journey.innerHTML='<span>NEW TO THE ATELIER?</span> Explore the couture journey, consultations and international guidance <b>↗</b>';hub.append(journey)}
 document.querySelectorAll('.site-footer a').forEach(link=>{if(link.textContent.trim()==='Couture Experience')link.href='experience.html'});
 const footerCollections=Array.from(document.querySelectorAll('.site-footer .footer-column a')).find(link=>link.textContent.trim()==='Collections');
 if(footerCollections){
  const wrapper=document.createElement('div');wrapper.className='footer-collections';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='footer-collections-trigger';trigger.textContent='Collections';trigger.setAttribute('aria-label','Choose a collection');trigger.setAttribute('aria-expanded','false');
  footerCollections.replaceWith(wrapper);wrapper.append(trigger);
  const menu=document.createElement('div');menu.className='footer-collections-menu';menu.id='footer-collections-menu';
  for(const [name,href] of [['The Forever Collection','bridal.html'],['The Unforgettable Collection','unforgettable.html']]){const option=document.createElement('a');option.href=href;option.textContent=name;menu.append(option)}
  trigger.setAttribute('aria-controls',menu.id);wrapper.append(menu);
  trigger.addEventListener('click',()=>{const open=wrapper.classList.toggle('is-open');trigger.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',event=>{if(!wrapper.contains(event.target)){wrapper.classList.remove('is-open');trigger.setAttribute('aria-expanded','false')}});
  wrapper.addEventListener('keydown',event=>{if(event.key==='Escape'){wrapper.classList.remove('is-open');trigger.setAttribute('aria-expanded','false');trigger.blur()}});
 }
});

(() => {
 const page=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('#navigation a').forEach(a=>{if(new URL(a.href).pathname.split('/').pop()===page){a.setAttribute('aria-current','page');a.closest('details')?.classList.add('nav-current')}});
 const heading=document.querySelector('.dress-heading');if(heading){const crumb=document.createElement('nav');crumb.className='page-breadcrumb';crumb.setAttribute('aria-label','Breadcrumb');crumb.innerHTML='<a href="index.html">Home</a><span>/</span><a href="wedding-dresses.html">Wedding Dresses</a>';heading.prepend(crumb);const description=heading.querySelector('.gown-description');if(description){const details=document.createElement('details');details.className='gown-details';details.open=true;const summary=document.createElement('summary');summary.textContent='Design details';description.before(details);details.append(summary,description)}}
 if(page==='contact.html'){const section=document.querySelector('#contact');const choices=document.createElement('div');choices.className='enquiry-choices';choices.setAttribute('aria-label','Choose your enquiry');[['Bridal','bespoke'],['Special Occasions','special'],['Wholesale','wholesale']].forEach(([label,value])=>{const a=document.createElement('a');a.textContent=label;a.href='contact.html?interest='+value;choices.append(a)});section?.querySelector('form')?.before(choices);if(new URLSearchParams(location.search).get('interest')==='special'){const select=document.querySelector('[name=interest]');if(select)select.value='Special event'}}
 if(page==='blog.html'){const empty=document.querySelector('.blog-empty');if(empty){const frame=document.createElement('div');frame.className='journal-feature';frame.innerHTML='<img src="assets/story-gallery/story-01.webp" alt="Zateemee bridal house" width="2200" height="2750"><div><p class="eyebrow">ZATEEMEE JOURNAL</p></div>';empty.before(frame);frame.querySelector('div').append(empty)}}
 const existing=document.querySelector('#cart-dialog');if(existing)existing.classList.add('cart-drawer');
})();
(() => {
 const cartButton=document.querySelector('[data-tool=cart]');if(!cartButton)return;let drawer=document.querySelector('#cart-dialog');if(!drawer){drawer=document.createElement('dialog');drawer.id='cart-dialog';document.body.append(drawer)}drawer.classList.add('cart-drawer');drawer.setAttribute('aria-label','Your Special Occasions cart');
 function read(){try{const value=JSON.parse(localStorage.getItem('zateemee-bag')||'[]');return Array.isArray(value)?value:[]}catch{return []}}
 const count=document.createElement('span');count.className='cart-count';count.setAttribute('aria-hidden','true');cartButton.append(count);
 function updateCount(){let variants={};try{variants=JSON.parse(localStorage.getItem('zt-cart-options')||'{}')||{}}catch{}const catalog=window.zateemeeOccasions||[];const total=[...new Set(read())].reduce((sum,name)=>{const product=catalog.find(item=>item.name===name);const quantity=Number(variants[product?.id]?.quantity);return sum+(Number.isInteger(quantity)&&quantity>0?Math.min(quantity,5):1)},0);count.textContent=String(total);count.hidden=!total;cartButton.setAttribute('aria-label',total?`Cart, ${total} ${total===1?'item':'items'}`:'Cart, empty')}
 window.addEventListener('zateemee:cart-change',updateCount);
 window.addEventListener('storage',event=>{if(event.key==='zateemee-bag'||event.key==='zt-cart-options')updateCount()});
 updateCount();
 function render(){drawer.replaceChildren();const close=document.createElement('button');close.className='close';close.type='button';close.textContent='×';close.setAttribute('aria-label','Close cart');close.addEventListener('click',()=>drawer.close());const title=document.createElement('h2');title.textContent='Your cart';drawer.append(close,title);const products=(window.zateemeeOccasions||[]).filter(p=>read().includes(p.name));if(!products.length){const empty=document.createElement('p');empty.textContent='Your cart is empty. Explore Special Occasions dresses.';drawer.append(empty)}products.forEach(p=>{const row=document.createElement('div');row.className='bag-row';const image=document.createElement('img');image.src='assets/'+p.image+'.webp';image.alt=p.name;const name=document.createElement('span');let quantity=1;try{const options=JSON.parse(localStorage.getItem('zt-cart-options')||'{}');quantity=Math.max(1,Math.min(5,Number(options[p.id]?.quantity)||1))}catch{}name.textContent=p.name+" — "+quantity+" × "+p.displayPrice;const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+p.name);remove.addEventListener('click',()=>{localStorage.setItem('zateemee-bag',JSON.stringify(read().filter(n=>n!==p.name)));window.dispatchEvent(new Event('zateemee:cart-change'));render()});row.append(image,name,remove);drawer.append(row)});const link=document.createElement('a');link.className='button burgundy';link.href=products.length?'checkout.html':'special-event.html';link.textContent=products.length?'Review cart & checkout':'Explore Special Occasions';drawer.append(link)}
 cartButton.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();render();drawer.showModal()},{capture:true});
})();

window.bridalDescriptions={"asa": "Off-the-shoulder draped satin gown featuring a sculpted sweetheart neckline and softly structured bodice. Soft ruching defines the waist, accentuated with a delicate crystal and pearl embellishment flowing into a sleek fit-and-flare skirt with an elongated train. The silhouette is refined and modern, balancing clean minimalism with subtle couture detail. Button down detail at the back.", "selena": "Off-the-shoulder draped satin ballgown featuring a sculpted sweetheart neckline and softly structured bodice. Precision pleating defines the waist before transitioning into a subtle basque detail that enhances the silhouette. The voluminous skirt falls into fluid, luminous folds with discreet pockets and an extended train, embodying modern royalty with refined couture simplicity.", "janice": "Illusion high-neck mermaid gown featuring intricate lace appliqu\u00e9 over sculpted corsetry with a plunging sweetheart underlay. The fitted silhouette contours the body before flaring into a delicate lace train with scalloped edging. Sheer lace sleeves and an illusion back finished with covered buttons add refined structure, while a dramatic detachable satin bow and extended train create a statement of timeless couture romance.", "candace": "High-neck halter gown fully hand-embellished with intricate crystal and sequin detailing throughout. The sculpted bodice contours seamlessly into a sleek column silhouette, elongating the frame with refined precision. It also has a detachable flowing train . A coordinating embellished cathedral-length veil adds soft drama and cohesive brilliance, creating a statement of modern couture elegance.", "anita": "heart shape Illusion high-neck ballgown featuring intricate lace appliqu\u00e9 with delicate hand embellishment throughout the bodice and long sheer sleeves. The sculpted corsetry defines the waist before flowing into a soft, voluminous tulle skirt layered with subtle shimmer and embroidered motifs. A cathedral-length veil completes the silhouette, embodying timeless romance with refined couture detail.", "simi": "Corseted ballgown featuring a sculpted sweetheart neckline with a defined basque waist. The structured bodice is adorned with delicate appliqu\u00e9 and hand embellishment, complemented by embellished neck piece and shoulder straps that drape elegantly along the arms. The full skirt unfolds into a voluminous silhouette creating a timeless statement of regal romance and refined couture elegance.", "esther": "Off-the-shoulder mermaid gown featuring an intricately embellished lace bodice with a sculpted sweetheart neckline and hand-placed lace long sleeves. Dimensional lace appliqué cascades over the corseted waist into a sleek satin skirt, contouring the silhouette before flowing into a refined train. A dramatic detachable drop-waist satin overskirt, with a statement drape and handmade flowers at the hip, adds regal volume and couture versatility, blending romance with modern structure."};
(() => {
 const grid=document.querySelector('.dress-folders');if(grid){const controls=document.createElement('div');controls.className='bridal-discovery';const label=document.createElement('label');label.textContent='Find your silhouette';const select=document.createElement('select');select.setAttribute('aria-label','Filter wedding dresses');['All dresses','Satin','Lace','Ballgown','Mermaid','Column'].forEach(value=>{const option=document.createElement('option');option.textContent=value;select.append(option)});label.append(select);const status=document.createElement('p');status.setAttribute('role','status');controls.append(label,status);grid.before(controls);function filter(){let count=0;grid.querySelectorAll('.dress-folder').forEach(card=>{const key=card.getAttribute('href').split('.')[0];const description=(window.bridalDescriptions[key]||'').toLowerCase();const visible=select.value==='All dresses'||description.includes(select.value.toLowerCase());card.hidden=!visible;if(visible)count++});status.textContent=count+(count===1?' dress':' dresses')}select.addEventListener('change',filter);filter()}
 if(location.pathname.endsWith('contact.html')){const form=document.querySelector('#enquiry-form');if(form){const label=document.createElement('label');label.textContent='Preferred consultation date (optional)';const date=document.createElement('input');date.type='date';date.name='consultation_date';const today=new Date();date.min=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');label.append(date);form.querySelector('[type=submit]').before(label);const note=document.createElement('p');note.className='consultation-note';note.textContent='Preferred dates are requests. The atelier will confirm availability.';label.after(note);form.addEventListener('submit',()=>{if(date.value){const message=form.querySelector('[name=message]');message.value=message.value.replace(/\nPreferred consultation date:.*$/,'')+'\nPreferred consultation date: '+date.value}},{capture:true})}}
 document.querySelectorAll('main img').forEach(img=>{img.decoding='async'});
})();

(()=>{
 const strip=document.querySelector('.recognition-summary');if(!strip)return;
 const number=Array.from(strip.querySelectorAll('.designer-facts strong')).find(node=>node.textContent.trim()==='11+');if(!number)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,timer,frame;
 number.setAttribute('aria-label','11 plus');const visual=document.createElement('span');visual.className='country-count';visual.setAttribute('aria-hidden','true');visual.textContent='11+';number.replaceChildren(visual);
 function stop(){clearTimeout(timer);cancelAnimationFrame(frame);number.classList.remove('counting');visual.textContent='11+'}
 function run(){if(!visible||reduced.matches||document.hidden)return;const start=performance.now();number.classList.add('counting');function tick(now){const progress=Math.min(1,(now-start)/1000);visual.textContent=Math.min(11,1+Math.floor(progress*11))+'+';if(progress<1)frame=requestAnimationFrame(tick);else{number.classList.remove('counting');timer=setTimeout(run,6000)}}frame=requestAnimationFrame(tick)}
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;stop();if(visible)run()},{threshold:.25}).observe(strip);
 document.addEventListener('visibilitychange',()=>{stop();if(!document.hidden)run()});reduced.addEventListener('change',()=>{stop();run()});
})();

(()=>{
 if(!document.body.classList.contains('page-contact'))return;
 const section=document.querySelector('#contact'),form=document.querySelector('#enquiry-form');if(!section||!form)return;
 const dialog=document.createElement('dialog');dialog.className='contact-enquiry-dialog';dialog.setAttribute('aria-labelledby','contact-enquiry-title');const close=document.createElement('button');close.type='button';close.className='contact-enquiry-close';close.setAttribute('aria-label','Close enquiry');close.textContent='×';const kicker=document.createElement('p');kicker.className='eyebrow';kicker.textContent='ZATEEMEE ATELIER';const title=document.createElement('h2');title.id='contact-enquiry-title';const introduction=document.createElement('p');introduction.className='contact-enquiry-intro';introduction.textContent='Tell us a little about yourself and what you have in mind.';dialog.append(close,kicker,title,introduction,form);document.body.append(dialog);
 const returnTo=new URLSearchParams(location.search).get('return')||sessionStorage.getItem('zt-enquiry-return');let trigger,closing=false;function dismiss(){if(closing||!dialog.open)return;closing=true;dialog.classList.add('contact-enquiry-leaving');setTimeout(()=>{dialog.close();dialog.classList.remove('contact-enquiry-leaving');closing=false;if(returnTo&&returnTo.startsWith('/')&&!returnTo.startsWith('//')){sessionStorage.removeItem('zt-enquiry-return');location.replace(returnTo)}},matchMedia('(prefers-reduced-motion: reduce)').matches?0:220)}close.onclick=dismiss;dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss()});dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dismiss()}});dialog.addEventListener('close',()=>trigger?.focus());
 const intro=document.createElement('div');intro.className='contact-welcome';const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='CONTACT THE ATELIER';const heading=document.createElement('h1');heading.textContent=document.body.classList.contains('page-press')?'Styling & press.':'Let’s create your moment.';const copy=document.createElement('p');copy.textContent='Choose your enquiry to begin a conversation with Zateemee.';intro.append(eyebrow,heading,copy);const choices=document.createElement('div');choices.className='contact-options';
 const options=[['I’m a bride','Collection gowns and bridal appointments.','Bridal appointment'],['I want bespoke couture','A personalised couture journey.','Bespoke Couture'],['I’m a boutique','Wholesale collections and stockist partnerships.','Wholesale'],['Press / styling','Editorial, press and styling enquiries.','Press / styling']];options.forEach(([label,description,value])=>{const button=document.createElement('button');button.type='button';const name=document.createElement('span');name.className='contact-option-name';name.textContent=label;const detail=document.createElement('span');detail.textContent=description;const action=document.createElement('span');action.className='contact-option-action';action.textContent='Start an enquiry';button.append(name,detail,action);button.onclick=()=>{if(value==='Wholesale'){location.href='wholesale.html';return}trigger=button;form.querySelector('[name=interest]').value=value;title.textContent=label+' enquiry';dialog.showModal()};choices.append(button)});section.replaceChildren(intro,choices);const contact=document.querySelector('.atelier-contact');if(contact)section.append(contact.cloneNode(true));section.className='contact-hub';
 form.querySelector('label').firstChild.textContent='Full name';
 const params=new URLSearchParams(location.search),requested=params.get('interest'),requestedGown=params.get('gown');if(document.body.classList.contains('page-press')){form.querySelector('[name=interest]').value='Press / styling';title.textContent='Press / styling enquiry';dialog.showModal()}if(requested==='wholesale'){location.replace('wholesale.html');return}if(requested==='ambassador'){location.replace('ambassador.html');return}if(requested){const values={bridal:'Bridal appointment',bespoke:'Bespoke Couture',couture:'Couture Experience',wholesale:'Wholesale',special:'Special event',press:'Press / styling'};if(values[requested]){form.querySelector('[name=interest]').value=values[requested];title.textContent=requestedGown?`Enquire about ${requestedGown.charAt(0).toUpperCase()+requestedGown.slice(1)}`:values[requested]+' enquiry';dialog.showModal()}}
})();

/* Preserve the originating gown or collection when an enquiry opens on Contact. */
(()=>{if(document.body.classList.contains('page-contact'))return;const origin=location.pathname+location.search+location.hash;document.querySelectorAll('a[href^="contact.html?interest="]').forEach(link=>{const url=new URL(link.getAttribute('href'),location.href),match=link.textContent.trim().match(/^Enquire about\s+(.+?)(?:\s*↗)?$/i),gown=match?.[1]?.trim();url.searchParams.set('return',origin);if(gown)url.searchParams.set('gown',gown);link.href=url.pathname+url.search;link.addEventListener('click',()=>{sessionStorage.setItem('zt-enquiry-return',origin);if(gown)sessionStorage.setItem('zateemee-gown',gown)})})})();

/* Sitewide consultation path, gown intelligence and private browsing history. */
(() => {
 let page=(location.pathname.split('/').pop()||'index.html').toLowerCase();if(!page.includes('.'))page+='.html';
 const gowns={
  'asa.html':{name:'Asa',image:'assets/asa-gallery/asa-01.webp',silhouette:'Fit-and-flare',fabric:'Draped satin',neckline:'Off-the-shoulder sweetheart',detail:'Crystal and pearl embellishment'},
  'selena.html':{name:'Selena',image:'assets/selena-gallery/selena-01.webp',silhouette:'Ballgown',fabric:'Luminous satin',neckline:'Off-the-shoulder sweetheart',detail:'Basque waist and discreet pockets'},
  'janice.html':{name:'Janice',image:'assets/janice-gallery/janice-01.webp',silhouette:'Mermaid',fabric:'Embroidered lace and satin',neckline:'Illusion high neck',detail:'Detachable statement bow'},
  'candace.html':{name:'Candace',image:'assets/candace-gallery/candace-01.webp',silhouette:'Column',fabric:'Hand-embellished crystal',neckline:'High halter',detail:'Detachable train and cathedral veil'},
  'anita.html':{name:'Anita',image:'assets/anita-gallery/anita-01.webp',silhouette:'Ballgown',fabric:'Lace and layered tulle',neckline:'Illusion sweetheart',detail:'Hand embellishment and cathedral veil'},
  'simi.html':{name:'Simi',image:'assets/simi-gallery/simi-01.webp',silhouette:'Ballgown',fabric:'Embellished tulle',neckline:'Sculpted sweetheart',detail:'Corsetry and basque waist'},
  'esther.html':{name:'Esther',image:'assets/esther-gallery/esther-01-refined.webp',silhouette:'Mermaid',fabric:'Embellished lace and satin',neckline:'Off-the-shoulder sweetheart',detail:'Detachable overskirt and handmade flowers'}
 };
 const gown=gowns[page];
 if(gown){
  const heading=document.querySelector('.dress-heading'),purchase=heading?.querySelector('.dress-purchase');
  if(heading&&purchase&&!heading.querySelector('.gown-specifications')){const specs=document.createElement('dl');specs.className='gown-specifications';[['Silhouette',gown.silhouette],['Fabric',gown.fabric],['Neckline',gown.neckline],['Signature detail',gown.detail],['Made to order','16 weeks · 12-week rush for an additional fee'],['Personalisation','Fit and couture details discussed with the atelier']].forEach(([term,value])=>{const item=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=term;dd.textContent=value;item.append(dt,dd);specs.append(item)});purchase.before(specs)}
  let history=[];try{history=JSON.parse(localStorage.getItem('zt-recently-viewed')||'[]')}catch{}history=[page,...history.filter(item=>item!==page)].slice(0,4);try{localStorage.setItem('zt-recently-viewed',JSON.stringify(history))}catch{}
 }
 let history=[];try{history=JSON.parse(localStorage.getItem('zt-recently-viewed')||'[]')}catch{}const recent=history.filter(key=>gowns[key]&&key!==page).slice(0,3),main=document.querySelector('main');
 if(main&&recent.length&&!document.querySelector('.recently-viewed')){const section=document.createElement('section');section.className='recently-viewed';section.innerHTML='<p class="eyebrow">YOUR EDIT</p><div class="recently-viewed-heading"><h2>Recently viewed</h2><a href="wedding-dresses.html">View all gowns ↗</a></div>';const grid=document.createElement('div');grid.className='recently-viewed-grid';recent.forEach(key=>{const item=gowns[key],link=document.createElement('a');link.href=key;link.innerHTML=`<img src="${item.image}" alt="${item.name} bridal gown" loading="lazy"><span>${item.name}</span>`;grid.append(link)});section.append(grid);main.append(section)}
 if(!['index.html','contact.html','checkout.html','client.html','ambassador.html'].includes(page)&&document.querySelector('header')){const rail=document.createElement('aside');rail.className='consultation-rail';rail.setAttribute('aria-label','Book a bridal consultation');rail.innerHTML='<span>YOUR COUTURE APPOINTMENT</span><a>Book a consultation <b>→</b></a>';rail.querySelector('a').href='contact.html?interest=couture&return='+encodeURIComponent(location.pathname+location.search+location.hash);document.body.append(rail)}
})();
