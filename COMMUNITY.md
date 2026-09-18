Community storage

Reviews, comments and reactions use data/community.sqlite through scripts/community-api.mjs. Run npm run dev (Node 22.13+). Public hosting must run this Node server with DATA_DIR on a persistent volume; GitHub Pages only serves static files and cannot run these database endpoints. Database files must not be committed. Back up DATA_DIR separately. The server blocks serving data/ and scripts/.

Approve feedback from the server terminal:
node scripts/moderate-community.mjs reviews list
node scripts/moderate-community.mjs reviews publish ENTRY_ID
Use comments in place of reviews for blog comments. Use reject instead of publish to reject an entry. Only approved feedback is public. The review invitation appears after 60 seconds, once per session, and can be dismissed.

Add approved articles to content/posts.json as an array of objects: id (unique URL-safe string), title, topic, date (YYYY-MM-DD), excerpt, body (plain text paragraphs separated by a blank line), image (optional local assets/ path), imageAlt. No sample posts or reviews are seeded. Likes/loves are toggled once per browser cookie, not verified person counts. Cookies must be enabled for reactions. Before public release, stronger spam protection and a private moderation UI may be appropriate.

Private approval screen: /moderation.html. Local development permits access only from loopback with a localhost host header. For hosted use set NODE_ENV=production and MODERATION_TOKEN to a long random secret; access is denied without the token. Enter it in the screen; it stays in memory, never URL/localStorage. Use HTTPS in production.
Email notifications: configure RESEND_API_KEY, REVIEW_NOTIFY_FROM (verified sending domain), REVIEW_NOTIFY_EMAIL (owner recipient), PUBLIC_SITE_URL (HTTPS website URL). Never commit these secrets. New reviews create a durable SQLite notification_outbox entry in the same transaction as the review. Delivery retries every minute with an idempotency key. The approval screen reports unconfigured delivery, queued messages and failures. Notification links lead to the token-protected approval queue, never approve by email-link GET. Existing pending reviews remain available in the queue; they are not automatically emailed retroactively.
This is still a local server until persistent hosting, backups and email settings are configured. SQLite needs a persistent DATA_DIR; a static-only deployment cannot run these endpoints. SMS is not configured.
