# Nouvelle Vision Software — Netlify + Render + Supabase

## Included
- Responsive storefront files (if included in this package source)
- Netlify static hosting configuration
- Express API for Render: `/api/health` and `/api/products`
- Supabase product catalogue SQL

## Deploy the website
1. Extract the ZIP.
2. In Netlify choose Add new site → Deploy manually.
3. Upload the project folder contents. `index.html` must be at the published root.
4. Netlify supplies a free `*.netlify.app` address (subject to its current plan limits).

## Set up Supabase
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Product rows are inactive until the actual software is ready.

## Deploy the API on Render
1. Create a Web Service from this project/repository.
2. Set Root Directory to `server`.
3. Build command: `npm install`; Start command: `npm start`.
4. Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `ALLOWED_ORIGINS` in Render environment settings.
5. Test `/api/health` on your Render URL.

## Connect
Edit `config.js`, set `apiBaseUrl` to the Render URL, then redeploy the Netlify site.

## Important
This is a storefront and catalogue API starter, not a finished SaaS or payment system. It does not collect payments or issue licenses yet. Confirm that payment providers support a Burundi-based merchant before choosing one. Never put the Supabase service-role key in frontend files. Build and test the actual Shop Manager Pro before making it purchasable. Add verified payment webhooks, customer authentication, admin controls, licensing, subscription management, legal pages, backups and monitoring before launch.
