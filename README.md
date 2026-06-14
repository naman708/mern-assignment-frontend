# MERN Assignment — Frontend

React.js single-page app for the user-management assignment. It consumes the backend
documented in [api.md](api.md) and covers registration with email verification, JWT auth
with silent refresh-token rotation, password reset, a paginated/searchable user directory,
profile viewing/editing, image upload with preview, and role-based admin actions.

## Tech stack

- **Vite + React 18** (JavaScript / JSX)
- **Tailwind CSS** for responsive styling
- **react-router-dom v6** for routing
- **react-hook-form** for form validation
- **Axios** for API requests (with token-attach + 401 refresh interceptors)
- **react-hot-toast** for notifications

## Prerequisites

- Node.js 18+ (developed on Node 20)
- The assignment backend running and reachable (default `http://localhost:5000`)

## Getting started

```bash
npm install

# Configure the backend URL (defaults to http://localhost:5000)
cp .env.example .env   # then edit if needed

npm run dev            # http://localhost:5173
```

Other scripts:

```bash
npm run build          # production build into dist/
npm run preview        # preview the production build
```

## Environment

| Variable        | Description                                              | Default                  |
| --------------- | -------------------------------------------------------- | ------------------------ |
| `VITE_API_URL`  | Backend origin (no trailing slash). The app appends `/api`. | `http://localhost:5000` |

## Project structure

```
src/
  api/         axios client + interceptors, auth & users API modules, token store
  context/     AuthContext (session bootstrap, login/logout)
  hooks/       useAuth
  components/  Navbar, ProtectedRoute, ImageUpload, Pagination, SearchBar,
               UserCard, Avatar, AuthShell, Spinner
  pages/       Login, Register, VerifyEmail, Forgot/Reset password,
               UsersList, UserProfile, MyProfile, NotFound
  utils/       validation rules, response normalizers, image helpers
```

## Features → requirements

- **Authentication** — register (multipart with optional avatar), email verification,
  login, logout. Tokens are stored in `localStorage`; the session is restored on reload
  via `GET /users/me`.
- **Refresh-token rotation** — a response interceptor catches `401`, calls
  `POST /auth/refresh` once (single in-flight promise), stores the rotated pair, and
  retries the original request. On failure it clears the session and redirects to login.
- **Password reset** — forgot-password (generic confirmation) and reset-password (reads the
  token from the email link).
- **Users directory** — paginated grid with debounced search by name/email.
- **Profiles** — view any user (`/users/:id`) and edit your own (`/profile`, name + avatar).
- **RBAC** — admins see a Delete button on other users' cards (`DELETE /users/:id`);
  regular users do not. You cannot delete your own account.
- **Image upload with preview** — `ImageUpload` shows a live preview via
  `URL.createObjectURL`, validates type (JPEG/PNG/WebP) and size (≤2MB), and revokes object
  URLs on cleanup.
- **Validation** — every form uses react-hook-form with inline errors; password rules
  mirror the backend (≥8 chars, at least one letter and one number).
- **Responsive design** — Tailwind breakpoints, mobile hamburger nav, grid collapses
  1 → 2 → 3 columns.

## Notes

- Google social login is intentionally not implemented — `api.md` exposes no OAuth endpoint.
- API responses are read defensively (`utils/apiData.js`) to tolerate both flat and
  `{ success, data }` envelope shapes.
```
