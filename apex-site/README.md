# Apex Development & Marketing — website

Static site, no build step. Open `index.html` or serve the folder:

    python3 -m http.server 8000

## Files
- `index.html` — all page content (hero, services, process, projects, about, contact)
- `projects.js` — portfolio entries; edit this to add/remove projects
- `config.js` — `formEndpoint` for the contact form (empty = form disabled with a "please email us" message)
- `styles.css`, `main.js`, `assets/logo.svg`

## Before launch
1. Replace placeholders: contact email/phone, About copy, sample projects (search `PLACEHOLDER`).
2. Connect the form: set `formEndpoint` to Formspree/Basin or a Supabase Edge Function that inserts into a `leads` table.
   The payload includes `sms_consent`, `consent_text` and `submitted_at` — store all three; that's your TCPA consent record.
3. Have counsel review the SMS consent language and the footer disclaimer.
4. Deploy anywhere that serves static files (Netlify, Vercel, Cloudflare Pages, Railway static).
