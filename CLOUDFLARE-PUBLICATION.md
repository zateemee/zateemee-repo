# Cloudflare deployment and enquiry delivery

The production website is the Cloudflare static-assets Worker `zateemee` in the account selected by the owner. Its custom domains include zateemee.com. The current public source was recovered and preserved before applying the corrections, including African Couture, Ambassador, Couture Experience, collection search, local fonts and optimized video assets absent from the earlier repository version.

## Publish

Run `npm run build`. Upload the contents of `dist` through the existing Worker's New deployment / folder upload control. This is a static site; the existing dashboard uploader cannot run the Node SQLite services or Pages Functions. Do not upload scripts, data, .git, credentials or local test files.

## Forms

Contact and wholesale forms use FormSubmit's AJAX endpoint to deliver to the owner-confirmed info.zateemee@gmail.com. Subject lines include the selected interest, or `Wholesale enquiry — [boutique name]`. The first setup request was explicitly authorized by the owner and FormSubmit reported that an activation email was sent. The inbox owner must click Activate Form. A pending activation or service failure does not clear the visitor's fields or claim success. No further real test submissions were sent.

The same handler can use the existing Node /api/atelier/enquiries endpoint when the form's data-enquiry-provider attribute is omitted. The optional Pages Functions adapter under functions remains available for a future migration and requires the previously documented Resend secrets; it is not deployed by this static upload.

## Outstanding business details

WhatsApp is omitted until the owner confirms a WhatsApp number. The directory phone listing does not verify WhatsApp availability. Trunk-show/sample programme, minimum order, shipping/duties and a response-time promise remain subject to confirmation. The wholesale page invites enquiries about these terms rather than publishing placeholders or invented commitments.

## Validation

JavaScript syntax checks, build, integration tests and corrections tests; current-source checks of all 26 pages for unique descriptions and local links/assets; browser gown prefill and mobile overflow checks. Real inbox receipt remains to be confirmed after FormSubmit activation.
