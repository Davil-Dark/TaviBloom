# TaviBloom launch-prep package

Includes responsive static storefront, product search/filter/sort, cart and wishlist (localStorage), remote visual placeholder images with emoji fallback, animated CSS/JS Playtime scene, SEO metadata, JSON-LD, robots.txt, sitemap, and draft Privacy, Terms, Shipping, Returns, Contact, About, FAQ and Accessibility pages. A standalone HTML is included for Android preview.

## Must be completed before launch
- Replace `YOUR-SUBDOMAIN.YOUR-DOMAIN.com` everywhere with the actual domain.
- Replace every bracketed field in policies; these are drafts, not legal advice.
- Product images are Unsplash visual placeholders, not verified supplier product images. Replace them with accurate photos of actual products.
- Product prices, ratings and review counts are demo content. Replace or remove demo ratings/reviews before selling.
- This is not a production commerce backend: no admin login, database, real orders, stock sync, tax/shipping calculator, payments, transactional emails or newsletter provider.
- Playtime is CSS/JS animation, not an AI-generated video file. Actual product-specific video assets are not included.
- Deploy to Cloudflare Pages, connect the real subdomain, configure HTTPS, then update canonical/JSON-LD/sitemap URLs and submit sitemap in Google Search Console.
- Connect analytics and ad pixels with applicable privacy disclosures/consent; test all events before advertising.
- Verify US product safety, fulfilment, returns and customer-support workflows before taking orders.

## Cloudflare Pages
Upload/push the folder to a repository or use direct upload. Create a Pages project, set the directory containing index.html as root, leave build command empty for static assets and output directory `.`. Add the desired custom subdomain in Cloudflare and follow DNS instructions. Actual deployment requires access to your Cloudflare account.


## Deployment note (updated Oct 9, 2026)
Deploy the multi-file site using `index.html`, `styles.css`, `app.js`, and the separate policy HTML files in this folder. Do not deploy standalone preview exports. The business mailing address and store domain are still missing; all `LAUNCH REQUIRED` items must be completed before launch. The supplied support email has not been independently verified.


## Step 2 — Cloudflare D1 product API

This step adds a D1-backed catalog API at `GET /api/products`. The Pages Function is `functions/api/products.js`; it expects a D1 binding named `DB`. Product prices are stored as integer cents in D1. The SQL migration seeds the current 12 illustrative demo listings; verify supplier images, product specifications, safety documentation, inventory, and prices before selling.

### Set up in Cloudflare (do not skip)

1. Install Node.js on your computer if needed, then open a terminal in this `TaviBloom` folder.
2. Run `npx wrangler login` and finish Cloudflare sign-in.
3. Create the database: `npx wrangler d1 create tavibloom-products`.
4. Copy the `database_id` returned by Cloudflare into `wrangler.toml`, replacing `DATABASE_ID_HERE`. Do not deploy with the placeholder.
5. Apply the schema and demo seed locally first: `npx wrangler d1 migrations apply tavibloom-products --local`.
6. Test the Pages app locally: `npx wrangler pages dev .`. Open the local URL printed by Wrangler, then visit `/api/products` in the browser. It should return JSON with `count: 12` and a `products` array. The storefront should load products from this API.
7. Only after the local test passes, apply the migration remotely with `npx wrangler d1 migrations apply tavibloom-products --remote`. This creates/updates the remote catalog.
8. In Cloudflare Pages project settings, bind the D1 database with variable name `DB`, select `tavibloom-products`, and redeploy. If deploying via Wrangler config, ensure the Pages project uses this `wrangler.toml` and the correct database ID.
9. Re-test the deployed `/api/products` endpoint and storefront. Never expose credentials in frontend files.

### Important limitations in Step 2

- This is only the public read-only product API. There is no product admin/editor yet.
- Cart prices are still display-only at this step. Checkout must independently look up prices from D1 on the server before any payment session is created.
- The 12 initial listings and Unsplash images are illustrative demo content, not confirmed supplier products. Do not accept live orders for them until verified.
- Opening `index.html` directly with `file://` uses the local demo fallback because Cloudflare Pages Functions do not run from a file opened on disk.
