Community storage

Reviews, comments and reactions use data/community.sqlite through scripts/community-api.mjs. Run npm run dev (Node 22.13+). Public hosting must run this Node server with DATA_DIR on a persistent volume; GitHub Pages only serves static files and cannot run these database endpoints. Database files must not be committed. Back up DATA_DIR separately. The server blocks serving data/ and scripts/.

Approve feedback from the server terminal:
node scripts/moderate-community.mjs reviews list
node scripts/moderate-community.mjs reviews publish ENTRY_ID
Use comments in place of reviews for blog comments. Use reject instead of publish to reject an entry. Only approved feedback is public. The review invitation appears after 60 seconds, once per session, and can be dismissed.

Add approved articles to content/posts.json as an array of objects: id (unique URL-safe string), title, topic, date (YYYY-MM-DD), excerpt, body (plain text paragraphs separated by a blank line), image (optional local assets/ path), imageAlt. No sample posts or reviews are seeded. Likes/loves are toggled once per browser cookie, not verified person counts. Cookies must be enabled for reactions. Before public release, stronger spam protection and a private moderation UI may be appropriate.
