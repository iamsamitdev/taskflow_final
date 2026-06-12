# 📋 TaskFlow — ระบบจัดการงานของทีม

โปรเจกต์สุดท้ายของหลักสูตร **Basic to Intermediate React.js (อัปเดต 2026)**
React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + React Router v7 + Zustand + TanStack Query v5 + Hono + Prisma + PostgreSQL (Neon)

> ✅ โปรเจกต์นี้ผ่านการทดสอบ build และ E2E จริงแล้ว (Login → CRUD → Filter → Stats → Auth Guard → Validation)

---

## โครงสร้างโปรเจกต์

```
taskflow/
├── src/              # Frontend: React 19 + Vite (Feature-based structure)
├── server/           # Backend: Hono + Prisma + PostgreSQL
├── Dockerfile        # Docker build สำหรับ Frontend (multi-stage + Nginx)
├── nginx.conf        # Nginx config รองรับ React Router
├── docker-compose.yml# Orchestrate ทุก service (db + server + frontend)
├── .dockerignore     # Exclude ไฟล์ที่ไม่จำเป็นออกจาก Docker image
├── vercel.json       # rewrite สำหรับ SPA — กัน 404 ตอน refresh
└── .env.example
```

## 🚀 วิธีรันบนเครื่อง (Local Development)

### 1) เตรียมฐานข้อมูล

เลือกอย่างใดอย่างหนึ่ง:
- **Neon (แนะนำ):** สมัครฟรีที่ https://neon.tech → สร้าง Project → คัดลอก Connection String
- **PostgreSQL ในเครื่อง:** สร้าง database ชื่อ `taskflow`

### 2) ตั้งค่าและรันฝั่ง Server (API)

```bash
cd server
cp .env.example .env        # แก้ DATABASE_URL และ JWT_SECRET ให้เป็นของคุณ
npm install
npx prisma migrate dev      # สร้างตารางในฐานข้อมูล
npm run db:seed             # (ทางเลือก) ใส่ข้อมูลทดสอบ
npm run dev                 # API รันที่ http://localhost:3000
```

**บัญชีทดสอบจาก seed:**
| อีเมล | รหัสผ่าน | Role |
| --- | --- | --- |
| somchai@taskflow.dev | password123 | member |
| admin@taskflow.dev | password123 | admin |

### 3) รันฝั่ง Frontend

```bash
# กลับมาที่โฟลเดอร์หลัก taskflow/
cp .env.example .env        # ค่า default ชี้ http://localhost:3000/api อยู่แล้ว
npm install
npm run dev                 # เปิด http://localhost:5173
```

## 🌐 วิธี Deploy ขึ้น Production

### Frontend → Vercel

1. push โค้ดขึ้น GitHub
2. เข้า vercel.com → Add New Project → เลือก repo (Root Directory = โฟลเดอร์หลัก)
3. Vercel ตรวจพบ Vite อัตโนมัติ
4. ตั้ง Environment Variable: `VITE_API_URL` = URL ของ API ที่ deploy แล้ว เช่น `https://your-api.up.railway.app/api`
5. `vercel.json` จัดการ rewrite ให้แล้ว — refresh หน้าไหนก็ไม่ 404

### Server → Railway / Render / Fly.io

1. สร้างบริการใหม่ชี้ไปที่โฟลเดอร์ `server/`
2. ตั้ง Environment Variables: `DATABASE_URL` (จาก Neon), `JWT_SECRET`, `CORS_ORIGIN` (= URL ของ frontend บน Vercel)
3. Build Command: `npm install && npx prisma migrate deploy && npm run build`
4. Start Command: `npm start`

## 🐳 รันด้วย Docker (ทางเลือกแทน Local Dev)

### ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
| --- | --- |
| `Dockerfile` | Build Frontend (Node → build, Nginx → serve) |
| `nginx.conf` | Nginx config รองรับ React Router + cache static assets |
| `.dockerignore` | Exclude node_modules/dist/env ออกจาก image frontend |
| `server/Dockerfile` | Build Backend (Node → build TypeScript + Prisma, production stage) |
| `server/.dockerignore` | Exclude ไฟล์ไม่จำเป็นออกจาก image backend |
| `docker-compose.yml` | Orchestrate 3 services: PostgreSQL + Hono API + React/Nginx |

### วิธีใช้งาน

```bash
# 1. คัดลอก .env แล้วแก้ค่าตามต้องการ
cp .env.example .env

# 2. Build และ Start ทุก service พร้อมกัน
docker compose up -d --build

# 3. ดู logs แบบ real-time
docker compose logs -f

# 4. หยุดทุก service
docker compose down
```

### Ports

| Service | URL |
| --- | --- |
| Frontend (React) | http://localhost |
| Backend (Hono API) | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

> **หมายเหตุ:** `docker compose up` จะรัน `prisma migrate deploy` อัตโนมัติก่อน start server — ไม่ต้องรัน migrate แยก

### Environment Variables (docker-compose)

```env
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=taskflow_secret
POSTGRES_DB=taskflow
JWT_SECRET=change_this_to_a_strong_random_secret_in_production
```

---

## 🧪 ทดสอบ API ด้วย curl

```bash
# Login รับ token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"somchai@taskflow.dev","password":"password123"}'

# ดึงรายการงาน (แทน <TOKEN> ด้วยค่าที่ได้)
curl http://localhost:3000/api/tasks?page=1 -H "Authorization: Bearer <TOKEN>"
```

## 📚 เนื้อหาที่ครอบคลุม (Mapping กับหลักสูตร 5 วัน)

| วัน | สิ่งที่อยู่ในโปรเจกต์นี้ |
| --- | --- |
| 1 | Vite + TS, Path Alias @/, shadcn init, types/task.ts |
| 2 | TaskCard/TaskList (Props, key), Immutable update, Tabs/Select, Tailwind v4 |
| 3 | useEffect+Cleanup (Clock), useLocalStorage/useToggle, ThemeContext (Dark Mode), React 19 Form Action + useFormStatus (AddTaskForm) |
| 4 | React Router v7 (Layout/Protected/Dynamic Route, filter ใน URL), RHF+Zod (Login/Register), Zustand persist |
| 5 | TanStack Query (Query Key factory, invalidate, placeholderData), Prisma+Neon, JWT+bcrypt, Role-based, React.lazy (Dashboard), ErrorBoundary, Deploy |

---
*บริษัท ไอทีจีเนียส เอ็นจิเนียริ่ง จำกัด — วิทยากร: อาจารย์สามิตร โกยม*
*www.itgenius.co.th*
