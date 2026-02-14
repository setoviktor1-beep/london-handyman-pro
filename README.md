# London Handyman Pro

Static landing page + admin panel for GitHub Pages.

## Live links
- Website: `https://setoviktor1-beep.github.io/london-handyman-pro/`
- Admin: `https://setoviktor1-beep.github.io/london-handyman-pro/admin.html`

## Tech stack
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- LocalStorage (all content is stored in browser storage)

## Important how admin works
Admin edits are saved in **your current browser LocalStorage**.
That means:
- Changes are visible immediately on the same browser/device.
- If you open site on another device/browser, those local edits are not there.
- To move content between devices, use `Export JSON` and `Import JSON` in admin settings.

## Admin login
1. Open `admin.html`.
2. Enter password.
3. Default password: `admin123`.
4. Change it in `Settings -> Admin Security`.

## Admin menu overview

### 1. Dashboard
Shows quick stats:
- Total inquiries
- This month inquiries
- Contacted count
- Recent inquiries table

Use this page as quick overview only.

### 2. Services
Use this page to edit cards in `Our Services` section.

What you can do:
- Add service
- Edit service
- Delete service

Fields:
- `Icon (lucide name)` (example: `zap`, `wrench`, `droplets`)
- `Title`
- `Description`

Tip:
- Keep titles short (2-4 words) for clean card layout.

### 3. Pricing
Edits pricing cards in `Transparent Pricing` section.

Per tier you can edit:
- Tier name
- Price
- Unit (example: `/hour`)
- Description
- Features (one per line)
- Popular toggle

Tip:
- Keep 3-4 features max per card for best visual balance.

### 4. Portfolio
Edits `Recent Projects` section.

You can:
- Add item
- Edit item
- Delete item

Fields:
- Title
- Description
- Location
- Image URL (optional)

If `Image URL` is empty:
- Gradient placeholder is shown automatically.

Image recommendations:
- Use landscape images (4:3 ratio works best).
- Use optimized files for faster loading.

### 5. Reviews
Edits testimonials section.

You can:
- Add review
- Edit review
- Delete review

Fields:
- Quote
- Author name
- Location
- Rating (1-5)

Tip:
- Keep quotes realistic and not too long (1-3 sentences).

### 6. Inquiries
All contact form submissions appear here.

Functions:
- View inquiry details
- Change status (`New`, `Contacted`, `Completed`)
- Delete inquiry
- Export CSV

Recommended workflow:
1. New inquiry comes in as `New`.
2. After first call/email change to `Contacted`.
3. After job completion change to `Completed`.

### 7. Settings
Contains 3 blocks.

#### Business Information
Updates contact data shown on landing page:
- Business name
- Phone
- Email
- Address/location
- Working hours

#### Admin Security
Change admin password:
- Current password
- New password
- Confirm password

#### Data Management
- `Export All Data` -> downloads full JSON backup
- `Import Data` -> restores data from JSON file
- `Reset to Defaults` -> resets everything to initial template

## Recommended editing process
1. Open `admin.html`.
2. Update content section by section (Services, Pricing, Portfolio, Reviews).
3. Update `Business Information` in Settings.
4. Check website page in a new tab (`index.html` / live URL).
5. Export JSON backup after major edits.

## Backup and restore (important)
Use this flow regularly:
1. `Settings -> Export All Data`
2. Save JSON file safely (cloud drive recommended)
3. To restore: `Settings -> Import Data`

This protects content if browser storage is cleared.

## If edits are not visible
Check these first:
1. Hard refresh page (`Ctrl + F5`).
2. Make sure you are in the same browser profile where edits were made.
3. Confirm no extension blocks LocalStorage.
4. Re-import your latest JSON backup.

## Local run
You can open files directly or use a local static server.

Main files:
- `index.html`
- `admin.html`
- `css/style.css`
- `css/admin.css`
- `css/animations.css`
- `js/data.js`
- `js/main.js`
- `js/admin.js`

## Deployment (GitHub Pages)
Project is already configured for static hosting.

General flow for future updates:
1. Edit files locally.
2. Commit changes.
3. Push to `master` branch.
4. GitHub Pages redeploys automatically.

## Notes
- Social links currently point to main network homepages (Facebook/Instagram/Telegram).
- Replace those URLs in `index.html` when client social profiles are ready.
- `robots.txt` and `sitemap.xml` are included for SEO basics.
