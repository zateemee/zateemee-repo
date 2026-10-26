# Cloudflare publication

The GitHub repository and the live Cloudflare website differed before these changes. The live site contains additional pages, layout improvements and backend integrations absent from this repository. Review and apply the correction commit to the current Cloudflare source rather than replacing that deployment with the older repository wholesale.

## Enquiry delivery

For Cloudflare Pages, the new `functions/api/atelier/enquiries.js` route sends contact and wholesale submissions through Resend. Build command: `npm run build`; output: `dist`; Pages Functions directory: `functions` at repository root. Dashboard drag-and-drop of `dist` alone will not deploy Functions. Use the existing Git integration or Wrangler Pages deployment from the repository root. If the current project is a Worker rather than Pages, port the route into its existing Worker; do not replace the Worker.

Set the following Cloudflare production environment values:

- `RESEND_API_KEY`: secret from the atelier's Resend account.
- `REVIEW_NOTIFY_EMAIL`: confirmed atelier recipient. The publicly listed business email is info.zateemee@gmail.com.
- `REVIEW_NOTIFY_FROM`: a verified sender in the Resend account.
- `WHOLESALE_NOTIFY_EMAIL`: confirmed wholesale recipient; defaults to the atelier recipient.

The server never exposes these credentials in browser code. The Cloudflare route returns success only after the mail provider accepts the message. Missing configuration and delivery errors retain the visitor's form fields and show an email fallback. The existing Node backend persists enquiries and queues mail, and explicitly reports saved status rather than claiming inbox delivery.

Confirm WhatsApp number before adding its link. A directory lists a phone number but does not identify it as WhatsApp. Confirm the wholesale recipient, sample/trunk-show programme, minimum order, shipping regions/duties and promised response time. The page invites boutiques to discuss these terms without publishing placeholders or invented commitments.

## Validation before publication

Run `npm run build`, `node scripts/integration-test.mjs`, and `node scripts/corrections-test.mjs`.

Verify every interest option and the wholesale form against a staging inbox; confirm receipt and subject lines. Verify press articles and mobile pages. No real customer enquiry or external email was sent during local testing.

No Cloudflare account credential or project access was available in this session, so the domain has not been redeployed.
