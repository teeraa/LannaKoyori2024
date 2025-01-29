const { createServer } = require('http');
const next = require('next');

// กำหนดโหมดการทำงาน (development หรือ production)
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// สร้าง Server และผูก Request
app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res); // ให้ Next.js จัดการ Request ทั้งหมด
  }).listen(process.env.PORT || 3000, () => {
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});
