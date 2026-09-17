# Zateemee client portal

The person icon opens client account sign-in and registration. The redesigned client modules are built into one portal; the supplied staff HTML applications are reference material, not embedded public staff consoles. All 64 measurement fields are preserved. Customers can save their own fit details and request appointments, which appear in their calendar. Production is read-only and empty until an atelier order is linked.

## Run

Use Node 26 (tested), then `npm run dev`. Open `/client.html`. `npm run build` creates the frontend in dist; `npm start` serves dist with the same account API. Accounts and client records are persisted in `data/clients.sqlite`, ignored by Git. Set DATA_DIR to a persistent directory on the deployed server. Set NODE_ENV=production, HOST=0.0.0.0 and PORT as required by the host; use HTTPS so secure session cookies work. Back up the SQLite database using SQLite backup tooling. Do not deploy this backend to an ephemeral filesystem or GitHub Pages.

## What works

- Registration and sign-in with scrypt password hashes, opaque HttpOnly sessions and server-side ownership checks.
- Measurements and appointment requests persist across browser sessions.
- Client calendar reads the same appointment records; no fabricated confirmed bookings.
- Production reads only the signed-in client's linked record.

## Connections still required before a public client rollout

The supplied apps reference missing staff APIs, image upload, payment and reminder services. Those services were not provided. This implementation does not import their localStorage databases, collect consultation payments, send email, or expose staff screens. An authenticated staff workflow must link orders, publish production milestones and confirm appointment requests. There is currently no production-writing endpoint for clients. Email verification and password recovery still need an email provider. A deployed account is created immediately without email verification. Appointment times are explicitly preferences in atelier local time; configure the atelier timezone and confirmed availability before accepting live bookings. No account or record data is pushed to GitHub.
