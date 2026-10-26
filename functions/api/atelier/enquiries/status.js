export function onRequestGet({env}) {
 return Response.json({available:!!(env.RESEND_API_KEY&&env.REVIEW_NOTIFY_EMAIL&&env.REVIEW_NOTIFY_FROM)},{headers:{'Cache-Control':'no-store'}});
}
