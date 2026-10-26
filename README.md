# Zateemee Bride & Atelier

A responsive, photography-led website for The Forever Collection, designed around the supplied Zateemee campaign materials.

## Run locally

Requires Node.js 24 or newer (native SQLite). No package installation is needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173.

```sh
npm run build
```

Production is a Cloudflare static-assets Worker. Run the build and upload dist through its existing dashboard. Contact and wholesale forms use FormSubmit with the owner-confirmed recipient. The Node server and optional Pages Functions adapters remain available for future backend hosting. See CLOUDFLARE-PUBLICATION.md.

## Content and behaviour

- Seven bridal gowns with descriptions, colour options and production timelines from the supplied line sheet.
- Material filters, accessible native detail dialogs, mobile navigation and an expanded editorial lookbook.
- Optimised WebP versions of the supplied photographs and the short behind-the-scenes campaign video.
- Bespoke special-event and retailer enquiries.
- Contact and wholesale forms send enquiries through FormSubmit to the confirmed atelier email; the inbox owner must complete the one-time activation. Public email and Instagram links are included in the footer.

Draft pricing varies across the supplied documents, so no draft prices are published. The original wholesale costs, pricing strategy and private line sheets are intentionally excluded from public assets. Image-to-gown assignments are based on the silhouettes and captions supplied and should receive a final brand review. Simi is represented by the supplied captioned sample image.

Duplicate and zero-byte files were excluded. Large duplicate 126 MB / 486 MB video exports were not committed; the supplied short BTS video is embedded and a second short campaign clip is retained in `assets/campaign-film.mp4`. Google Fonts are optional; local serif and sans-serif fallbacks are defined.
