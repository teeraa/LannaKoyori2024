import { createServer, IncomingMessage, ServerResponse } from 'http';
import next from 'next';

// กำหนดโหมดการทำงาน (development หรือ production)
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// สร้าง Server และผูก Request
app.prepare().then(() => {
  createServer((req: IncomingMessage, res: ServerResponse) => {
    handle(req, res); // ให้ Next.js จัดการ Request ทั้งหมด
  }).listen(process.env.PORT || 3000, () => {
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});
