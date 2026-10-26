// Cloudflare Pages Functions adapter. Configure secrets in the Pages project settings.
const json = (data, status=200) => Response.json(data, {status, headers:{'Cache-Control':'no-store'}});
export async function onRequestPost({request,env}) {
  if (request.headers.get('Origin') !== new URL(request.url).origin) return json({error:'Request origin rejected'},403);
  if (!env.RESEND_API_KEY || !env.REVIEW_NOTIFY_EMAIL || !env.REVIEW_NOTIFY_FROM) return json({error:'Online enquiries are temporarily unavailable. Please email info.zateemee@gmail.com.'},503);
  if (Number(request.headers.get('Content-Length')||0)>40000) return json({error:'Request too large'},413);
  let data;
  try { const raw=await request.text(); if(raw.length>40000)return json({error:'Request too large'},413); data=JSON.parse(raw); } catch { return json({error:'Invalid request'},400); }
  const str=(key,max,required=true)=>{const v=data?.[key];if((required&&(!v||typeof v!=='string'))||(v&&typeof v!=='string')||(v&&v.length>max))throw Error('Please complete all required fields.');return (v||'').trim()};
  let name,email,interest,message,boutique,location,website;
  try {
    name=str('name',80);email=str('email',254);interest=str('interest',100);message=str('message',4000);
    if(!name||!interest||!message||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Please complete all required fields with a valid email address.');
    if(interest==='Wholesale'){boutique=str('boutique',120);location=str('location',160);website=str('website',300);if(!boutique||!location||!website)throw Error('Please complete your boutique details.');message=`Boutique: ${boutique}\nCity and country: ${location}\nWebsite or Instagram: ${website}\n\n${message}`;}
    const country=str('country',80,false),date=str('consultation_date',40,false);if(country)message+='\nCountry: '+country;if(date)message+='\nPreferred consultation date: '+date;
  } catch(error) {return json({error:error.message},400);}
  const reference='ZT-'+crypto.randomUUID().slice(0,12).toUpperCase();
  const subject=interest==='Wholesale'?'Wholesale enquiry — '+boutique:'Zateemee enquiry — '+interest;
  try {
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.REVIEW_NOTIFY_FROM,to:[interest==='Wholesale'?(env.WHOLESALE_NOTIFY_EMAIL||env.REVIEW_NOTIFY_EMAIL):env.REVIEW_NOTIFY_EMAIL],reply_to:email,subject:subject.replace(/[\r\n]/g,' '),text:`${name}\n${email}\n${interest}\n\n${message}\n\nReference: ${reference}`}),signal:AbortSignal.timeout(15000)});
    if(!response.ok)return json({error:'Your enquiry could not be sent. Please try again or email info.zateemee@gmail.com.'},502);
    return json({reference,message:"Thank you. Your enquiry has reached the atelier, and we'll be in touch."},201);
  } catch {return json({error:'Your enquiry could not be sent. Please try again or email info.zateemee@gmail.com.'},502);}
}
