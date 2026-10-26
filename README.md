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

The Node server supports persistent API services. Cloudflare Pages can serve `dist/` with the enquiry Functions in `functions/`; see CLOUDFLARE-PUBLICATION.md for the mail settings and deployment requirements. Other database-backed services require their existing server or Worker adapters.

## Content and behaviour

- Seven bridal gowns with descriptions, colour options and production timelines from the supplied line sheet.
- Material filters, accessible native detail dialogs, mobile navigation and an expanded editorial lookbook.
- Optimised WebP versions of the supplied photographs and the short behind-the-scenes campaign video.
- Bespoke special-event and retailer enquiries.
- Contact and wholesale forms submit directly to the enquiry API. Email delivery requires configured mail credentials; see CLOUDFLARE-PUBLICATION.md. Public email and Instagram links are included in the footer.

Draft pricing varies across the supplied documents, so no draft prices are published. The original wholesale costs, pricing strategy and private line sheets are intentionally excluded from public assets. Image-to-gown assignments are based on the silhouettes and captions supplied and should receive a final brand review. Simi is represented by the supplied captioned sample image.

Duplicate and zero-byte files were excluded. Large duplicate 126 MB / 486 MB video exports were not committed; the supplied short BTS video is embedded and a second short campaign clip is retained in `assets/campaign-film.mp4`. Google Fonts are optional; local serif and sans-serif fallbacks are defined.
