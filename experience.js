const form=document.querySelector('#experience-form');
const slotField=document.querySelector('#experience-slot');
const status=document.querySelector('#experience-status');
const dateField=form.elements.consultation_date;
const today=new Date();
dateField.min=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
const interest=new URLSearchParams(location.search).get('interest');
if(interest==='bespoke'||interest==='couture')form.elements.interest.value='Bespoke Couture';
if(interest==='occasion')form.elements.interest.value='Special event';
async function loadSlots(){
  try{
    const response=await fetch('/api/atelier/slots');
    if(!response.ok)throw new Error();
    const slots=await response.json();
    slotField.replaceChildren(new Option(slots.length?'Request another date':'No published times — request a date',''));
    for(const slot of slots){
      const time=new Date(slot.time);
      slotField.add(new Option(new Intl.DateTimeFormat(undefined,{dateStyle:'full',timeStyle:'short'}).format(time)+' (your local time)',slot.id));
    }
  }catch{slotField.replaceChildren(new Option('Availability unavailable — request a date',''));}
}
loadSlots();
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=form.querySelector('[type=submit]');
  button.disabled=true;status.textContent='Sending your request…';
  try{
    const data=Object.fromEntries(new FormData(form));
    const response=await fetch('/api/atelier/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||'Your request could not be sent.');
    status.textContent=result.appointmentReserved?`Your selected time is reserved. Reference: ${result.reference}. The atelier will confirm the remaining details.`:`Your request is saved. Reference: ${result.reference}. The atelier will follow up about a time.`;
    form.reset();await loadSlots();
  }catch(error){status.textContent=error.message;await loadSlots()}
  finally{button.disabled=false}
});
