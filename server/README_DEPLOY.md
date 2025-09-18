Run locally:

1\. cd server

2\. npm install

3\. cp .env.example .env   (edit if you want to change SYNC\_TOKEN)

4\. node server.js

&nbsp;  -> server runs on http://localhost:4000



Test endpoints:

\- GET  http://localhost:4000/health

\- POST http://localhost:4000/login   { "username":"admin","password":"admin123" }  (only if you created staff)

\- GET  http://localhost:4000/orders

\- POST http://localhost:4000/orders  (single order JSON)

\- POST http://localhost:4000/orders/bulk  (array of orders or { orders: \[...] })



Deploy:

\- Railway / Render / Fly: create a new web service, upload repo or zip, set env vars (DB\_FILE, SYNC\_TOKEN), deploy.



