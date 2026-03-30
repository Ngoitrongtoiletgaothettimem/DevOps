# DevOps Mini Project

## Mục tiêu (mapping theo đề)
- Backend + Frontend + Database
- Có `/about` (thông tin sinh viên)
- Có `/health` trả về `{ "status": "ok" }`
- Dùng `.env` + `.env.example`
- Có Dockerfile cho backend/frontend và chạy được bằng `docker compose`

## Chạy local (không Docker)
> Backend code nằm trong thư mục `backend/`.

### Backend
```bash
cd backend
npm install
npm run dev
```
- API: `http://localhost:3000`
- Health: `GET http://localhost:3000/health`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web: `http://localhost:5173`

> Lưu ý: local mode cần 1 MySQL đang chạy và cấu hình `.env` ở root.

## Chạy bằng Docker Compose
```bash
docker compose up --build
```
- Frontend: `http://localhost:18080`
- Backend: `http://localhost:3000/health`
- MySQL: không publish port ra host (tránh xung đột 3306)

## API
- `GET /health` -> `{ "status": "ok" }`
- `GET /api/tasks` -> `{ items: [...] }`
- `POST /api/tasks` body: `{ "title": "..." }`
- `PUT /api/tasks/:id` body: `{ "isDone": true/false }`

## Nơi cần sửa để nộp bài
- Sửa thông tin sinh viên trong `frontend/src/App.jsx` (About page)
- Đổi tên app trong `.env` và `frontend/.env`
