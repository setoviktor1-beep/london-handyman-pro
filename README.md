# London Handyman Pro

Static landing page + admin panel for GitHub Pages.

## Stack
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- LocalStorage persistence

## Run locally
1. Open `index.html` in browser, or use a static server.
2. Open `admin.html` to manage content.

## Admin access
- Default password: `admin123`
- You can change it in `Settings` inside admin.

## Project structure
- `index.html` - Landing page
- `admin.html` - Admin panel
- `css/style.css` - Landing styles
- `css/admin.css` - Admin styles
- `css/animations.css` - Animation utilities
- `js/data.js` - Default data + storage helpers
- `js/main.js` - Landing interactions and dynamic content
- `js/admin.js` - Admin authentication and CRUD
- `robots.txt` - Crawl instructions
- `sitemap.xml` - Sitemap

## Features
- Dynamic sections loaded from localStorage data
- Contact form with validation and inquiry storage
- Admin panel with CRUD for services, pricing, portfolio, testimonials
- Inquiry status updates + CSV export
- Full data JSON export/import + reset
- Business settings + admin password update

## Deployment (GitHub Pages)
1. Push this folder to a GitHub repository.
2. In repository settings, enable GitHub Pages from the branch root.
3. Site will be available on your Pages URL.

## Notes
- Placeholder images are CSS gradients by default.
- For portfolio photos, add image URLs in admin panel.
- Replace placeholder business contact details in admin settings.
