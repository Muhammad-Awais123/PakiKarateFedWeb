# Pakistan Karate Federation Website

PKF website built with **React + Vite (frontend)** and **Node.js + Express + MongoDB (backend)**.

## Setup

### Prerequisites
- Node.js (LTS)
- MongoDB

### Install dependencies
1. Frontend:
   - `npm install`
2. Backend:
   - `cd backend`
   - `npm install`
   - Create `backend/.env` (see Environment Variables below).
3. Create admin user (first time only):
   - `cd backend`
   - `npm run seed:admin`
   - Default credentials: **admin@pkf.com.pk** / **Admin@1234**

## Development

Run both frontend and backend:
1. Backend:
   - `cd backend`
   - `npm run server`
2. Frontend:
   - In project root:
   - `npm run dev`

## Admin Panel

- **URL:** `http://localhost:5173/admin/login` (or set `VITE_ADMIN_PATH` for a custom path)
- **Default credentials:**
  - Email: `admin@pkf.com.pk`
  - Password: `Admin@1234`

To create or reset the admin user:
```bash
cd backend
npm run seed:admin
# Or with custom credentials:
node data/seedAdmin.js --email your@email.com --password YourPassword
```

## Environment Variables

### Frontend (.env.local)
Frontend uses Vite environment variables:
- `VITE_API_BASE_URL` (e.g. `http://localhost:5000/api`)
- `VITE_ADMIN_PATH` (secret admin login route, e.g. `/pkf-admin-secure`)

### Backend (backend/.env)
Backend requires:
- `PORT` (default `5000`)
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (e.g. `7d`)
- `NODE_ENV`
- `CORS_ORIGIN` (e.g. `http://localhost:5173`)

## API shape (admin events ↔ frontend)

Admin **Create/Update Event** uses `multipart/form-data` against:

- `POST /api/admin/events` / `PUT /api/admin/events/:id`

Field values for enums must match `backend/models/Event.js` (the admin UI uses `src/constants/eventEnums.js` as the single source on the frontend). Optional **Series name** must be one of the listed PKF/international options or left as “None” (stored as `null`).

## Event registration (end-to-end)

1. In **Admin → Events**, enable **Registration Open**, set **Registration fee** and bank **payment** fields as needed, and publish the event.
2. Public **Event detail** (`/events/:id`) shows the registration form when the event is **upcoming** and **Registration Open** is on.
3. **Submit** sends `multipart/form-data` to `POST /api/registrations` with:

   | Form field | Backend usage |
   |------------|----------------|
   | `eventId` | Required; MongoDB event `_id` |
   | `firstName`, `lastName` | Combined for display / validation |
   | `dob`, `gender`, `email`, `phone` | Participant details |
   | `weightCategory` | Stored as registration `category` |
   | `beltGrade` | Belt / grade |
   | `clubName` | Stored as `club` (required) |
   | `city`, `province`, `cnic` | Location / ID |
   | `paymentScreenshot` | File upload (required) |

4. Admins review listings at `GET /api/admin/registrations` and approve/reject via `PUT /api/admin/registrations/:id/status`.

## Deployment

1. Set `backend/.env` with production MongoDB + JWT + `CORS_ORIGIN`.
2. Set frontend `VITE_API_BASE_URL` and `VITE_ADMIN_PATH` (e.g. using `.env.production`).
3. Build frontend:
   - `npm run build`
4. Start backend with:
   - `cd backend && npm run start`
