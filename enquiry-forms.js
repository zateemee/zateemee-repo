const form = document.querySelector('#enquiry-form, #wholesale-form');
if (form) {
  const wholesale = form.id === 'wholesale-form';
  const button = form.querySelector('[type=submit]');
  const status = form.querySelector(wholesale ? '#wholesale-status' : '#form-note');
  status.setAttribute('role', 'status');
  if (!wholesale) {
    const fields = document.createElement('fieldset');
    fields.className = 'wholesale-contact-fields';
    const legend = document.createElement('legend'); legend.textContent = 'Your boutique'; fields.append(legend);
    for (const [name,title,max] of [['boutique','Boutique name',120],['location','City and country',160],['website','Website or Instagram',300]]) {
      const label=document.createElement('label'); label.textContent=title; const input=document.createElement('input');input.name=name;input.maxLength=max;input.required=true;label.append(input);fields.append(label);
    }
    form.querySelector('[name=message]').closest('label').before(fields);
    const sync=()=>{const active=form.elements.interest.value==='Wholesale';fields.hidden=!active;fields.disabled=!active;};
    form.elements.interest.addEventListener('change',sync);sync();form.addEventListener('reset',()=>setTimeout(sync,0));
    document.querySelectorAll('.contact-option-name').forEach(label=>{if(label.textContent==='Wholesale')label.closest('button').addEventListener('click',sync)});
  }
  const params = new URLSearchParams(location.search);
  const gown = params.get('gown');
  const names = {esther:'Esther',asa:'Asa',selena:'Selena',janice:'Janice',candace:'Candace',anita:'Anita',simi:'Simi'};
  if (!wholesale && names[gown?.toLowerCase()]) {
    form.elements.interest.value = 'Bridal appointment';
    form.elements.message.value = `I'd like to enquire about the ${names[gown.toLowerCase()]} gown.`;
  }
  button.textContent = wholesale ? 'Request line sheet' : 'Send enquiry';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (button.disabled || !form.reportValidity()) return;
    button.disabled = true;
    status.textContent = 'Sending your enquiry…';
    try {
      const data = Object.fromEntries(new FormData(form));
      if (data._honey) return;
      if (wholesale) data.interest = 'Wholesale';
      const provider = form.dataset.enquiryProvider;
      if (provider === 'formsubmit') {
        data._subject = data.interest === 'Wholesale' ? 'Wholesale enquiry — ' + data.boutique : 'Zateemee enquiry — ' + data.interest;
        data._template = 'table';
      }
      const endpoint = provider === 'formsubmit' ? 'https://formsubmit.co/ajax/info@zateemee.com' : '/api/atelier/enquiries';
      const response = await fetch(endpoint, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
      });
      let result;
      try { result = await response.json(); } catch { throw new Error('Online enquiries are temporarily unavailable. Please email info@zateemee.com.'); }
      if (!response.ok || (provider === 'formsubmit' && String(result.success) !== 'true')) throw new Error(result.error || result.message || 'Your enquiry could not be sent. Please try again.');
      status.textContent = provider === 'formsubmit' ? (wholesale ? 'Thank you. The line sheet request has reached our wholesale team, and we will reply by email.' : "Thank you. Your enquiry has reached the atelier, and we'll be in touch.") : result.message;
      window.dispatchEvent(new CustomEvent('zateemee:enquiry-sent',{detail:{type:wholesale?'wholesale':String(data.interest||'contact')}}));
      form.reset();
      const prepared = form.querySelector('#enquiry-result');
      if (prepared) prepared.hidden = true;
    } catch (error) {
      status.textContent = error.message || 'Your enquiry could not be sent. Please try again.';
    } finally { button.disabled = false; }
  }, {capture:true});
}
