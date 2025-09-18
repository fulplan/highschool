Shawarma Boss POS — Offline browser-only POS

Files:
- index.html
- style.css
- app.js
- manifest.json
- service-worker.js
- icons/
   - icon-192.png
   - icon-512.png
   - logo.png

How to run:
1. Place files in a folder and create an 'icons' folder with the three PNGs.
2. For best PWA behavior, serve via a local server:
   - Python: python -m http.server 8000
   - Or: npx http-server
3. Open http://localhost:8000 in your browser.

Login:
- Admin: admin / admin123
- Staff: staff1 / staff123

Notes:
- This project stores everything in localStorage. Use Export JSON to backup.
- The app forces default users on load to avoid lockouts.
- Replace icons/logo.png with your real logo for branding.
- Want a zip packaged or any changes (icons, colors, receipt layout, barcode scanning)? Tell me which and I’ll update.
