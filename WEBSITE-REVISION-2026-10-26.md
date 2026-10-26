# Zateemee website revision 26 October 2026

## Website changes
- Softened the homepage portrait/collection overlap with a short, frame-rate-independent glide, smaller movement, quieter edges and reduced-motion support.
- Restored the three missing 480px homepage images.
- Rewrote the ambassador page for the supplied 5% of net dress value programme, seven FAQs, four process steps, preserved anchors and dedicated application form.
- Configured ambassador applications for info@zateemee.com with CC to mercy@zateemee.com, including honeypot protection and an honest activation/error state.
- Updated general and wholesale enquiries to the owner-specified info@zateemee.com address.
- Expanded wholesale copy and gown links; corrected collection production to 16 weeks and rush production to 12 weeks for an additional fee. Unconfirmed minimums, shipping and trunk-show terms are discussed by enquiry, without invented values or public wholesale prices.
- Updated the homepage hero, international proof, bridal descriptors, designer positioning, Our Story's four visual chapters, occasionwear and African Couture positioning, and the Journal's four editorial sections.
- Simplified the footer into four navigation columns, with dedicated bride, couture, boutique and press routes.
- Added canonical URLs, sitemap.xml, robots.txt, Organization and accurate gown Product JSON-LD; excluded private, checkout, redirect and empty review pages from the sitemap.
- Added browser conversion events containing no personal enquiry fields. An analytics destination still needs configuration.

## Outstanding owner/account actions
1. FormSubmit sent an Activate Form email to info@zateemee.com. The inbox owner must activate it. Inbox receipt and CC delivery cannot be verified before activation.
2. The programme terms PDF was not included in the ZIP. The website offers a clearly labelled email request for terms; replace it with the actual approved PDF when supplied.
3. Cloudflare currently shows MX mail.eye-mail.net and SPF v=spf1 ip6:fdec:ae16:fda7::/48 -all, with no DKIM or DMARC record in its five-record table. The brief instead names Zoho. The owner confirmed Zoho Mail; its Admin Console sign-in is open. Obtain its exact regional records and DKIM selector/key before changing mail routing/authentication. No DNS records were changed.
4. Verify Google Search Console and Bing Webmaster Tools, submit the sitemap and inspect URLs using the appropriate owner accounts.
5. FormSubmit offers a 30-day submission archive via its API. A longer-lived CRM/database integration, automatic sender receipts, real inbox/SPF/DKIM/DMARC tests, Core Web Vitals measurements and a monthly reporting baseline remain separate integration/account work.
6. Confirm the founding year, WhatsApp number, business addresses and any further wholesale terms before adding unverified details. Existing evidenced 2014 biography wording was retained.
7. Existing Cloudflare bot preferences and WAF protections were left in place; the owner still needs to decide AI-training crawler policy.

Cloudflare production deployment ec90f7cd is Ready.

## Validation
Build, JavaScript syntax checks, existing API integration tests, website corrections tests, and dedicated ambassador tests. Ambassador tests use mocked provider responses and verify successful reset, CC/subject and activation failures retaining form values. Current-source checks cover 27 pages with unique descriptions and no missing local page/asset links. Mobile browser checks covered the changed pages without horizontal overflow. One setup/activation request to the domain email was sent; it reported activation required.

No rankings, indexing, email authentication passes or actual inbox receipt are claimed without evidence.
