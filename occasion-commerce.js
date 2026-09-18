(() => {
 const products=window.zateemeeOccasions||[];
 function read(){try{const bag=JSON.parse(localStorage.getItem('zateemee-bag')||'[]');return Array.isArray(bag)?bag:[]}catch{return []}}
 function write(bag){localStorage.setItem('zateemee-bag',JSON.stringify(bag))}
 const photos=document.querySelector('#occasion-product-photos');
 if(photos){
  const id=new URLSearchParams(location.search).get('dress');const product=products.find(p=>p.id===(id==='red-occasion-dress'?'red-evening-gown':id));
  if(!product){document.querySelector('#occasion-product-name').textContent='Dress not found';document.querySelector('#occasion-add').disabled=true;document.querySelector('.occasion-product-page').classList.add('occasion-ready');return}
  document.querySelector('#occasion-product-name').textContent=product.name;document.title=product.name+' — Zateemee';document.querySelector('.occasion-price').textContent=product.displayPrice;document.querySelector('.occasion-product-copy>p:not(.eyebrow)').textContent=product.description;
  product.photos.forEach((photo,index)=>{const button=document.createElement('button');button.type='button';button.dataset.photo='assets/special-occasions-gallery/'+photo+'.webp';button.setAttribute('aria-label','Expand dress photograph '+(index+1));const img=document.createElement('img');img.src=button.dataset.photo;img.alt=product.name+' — photograph '+(index+1);button.append(img);photos.append(button)});
  const firstImage=photos.querySelector('img'); const reveal=()=>document.querySelector('.occasion-product-page').classList.add('occasion-ready'); firstImage.decode().catch(()=>{}).then(reveal);
  document.querySelector('#occasion-add').addEventListener('click',()=>{try{const bag=read();if(!bag.includes(product.name))bag.push(product.name);write(bag);document.querySelector('#occasion-add-status').textContent='Added to your cart.'}catch{document.querySelector('#occasion-add-status').textContent='Your browser could not save the cart. Please enable browser storage and try again.'}});
 }
 const items=document.querySelector('#checkout-items');
 if(items){
  const catalog=products;
  function render(){items.replaceChildren();const selected=catalog.filter(p=>read().includes(p.name));document.querySelector('#checkout-summary').hidden=!selected.length;let total=document.querySelector('#cart-subtotal');if(!total){total=document.createElement('p');total.id='cart-subtotal';document.querySelector('#checkout-summary').prepend(total)}total.textContent='Dress subtotal: $'+selected.reduce((sum,p)=>sum+p.price,0).toLocaleString('en-US');if(!selected.length){items.textContent='Your cart is empty.';return}
   selected.forEach(product=>{const row=document.createElement('div');row.className='checkout-item';const img=document.createElement('img');img.src='assets/'+product.image+'.webp';img.alt=product.name;const text=document.createElement('div');const name=document.createElement('h2');name.textContent=product.name;const price=document.createElement('p');price.textContent=product.displayPrice;text.append(name,price);const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+product.name);remove.addEventListener('click',()=>{write(read().filter(n=>n!==product.name));render()});row.append(img,text,remove);items.append(row)});
  }
  render();document.querySelector('#checkout-enquire').addEventListener('click',()=>sessionStorage.setItem('zateemee-bag-enquiry',read().join(', ')));
 }
})();

