<!-- .github/copilot-instructions.md -->

# Copilot / Agent Hints for STUDY-MANAGEMENT-SYSTEM

This file contains concise, repository-specific guidance to help an AI coding agent be productive immediately.

Key points (read before editing):

- Project type: Vite + React + TypeScript (mixed .jsx/.tsx codebase). Main entry: `src/main.jsx`.
- Local dev: uses Vite. Scripts live in `package.json`.
- Data integrations: Supabase and Cloudinary. Environment variables use the `VITE_` prefix.
- Routing/layout: `src/App.jsx` wires routes and uses `ProtectedRoute` + `AppLayout`.

Quick commands

```
npm install
npm run dev       # starts vite dev server
npm run build     # runs `tsc -b` then `vite build`
npm run preview   # preview production build
npm run lint      # run eslint
```

Project layout highlights

- `src/main.jsx` — app bootstrap; wraps `App` with `ThemeProvider` and `AppWrapper`.
- `src/App.jsx` — central router. Routes are grouped under a `ProtectedRoute` that wraps `AppLayout`.
  - Add new pages under `src/pages/...` and import them in `App.jsx`.
- `src/layout/` — layout components (`AppLayout`, `AppSidebar`, `AppHeader`).
- `src/components/` — UI primitives grouped (auth, common, charts, ui, form, header, tables).
- `src/config/` — external integrations:
  - `supabaseClient.ts` — single Supabase client; use `import supabase from 'src/config/supabaseClient.ts'`.
  - `cloudinaryConfig.js` — Cloudinary helper and `uploadImageToCloudinary(file)` returning `{ success, url, publicId, data }`.
- `src/api/` — lightweight data fetch helpers (e.g., `dashboardStats.js`).
- `src/context/` — React Contexts (Theme, Sidebar). Prefer these for global state.

Important conventions and patterns

- Mixed extensions: many UI pages/components are `.jsx` while some shared utilities and contexts use `.tsx`. When adding TypeScript, prefer `.tsx` and keep type-safe exports.
- Environment vars: read via `import.meta.env.VITE_*`. Critical keys:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`
  - `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_CLOUDINARY_API_KEY`
- Routing pattern: `App.jsx` defines routes explicitly. Protected routes wrap `AppLayout` and expose nested routes using React Router v7-style `Routes`/`Route` imports from `react-router`.
- Auth guard: `src/components/ProtectedRoute.jsx` is the single source of truth for route protection — update there if auth flow changes.
- Toasts: global `react-toastify` container added in `App.jsx` — prefer to use to show user feedback.
- File uploads: use `uploadImageToCloudinary` in `src/config/cloudinaryConfig.js` and handle its `{ success, url }` response shape.

Editing and adding features

- To add a new page:

  1. Create files under `src/pages/<feature>/` (e.g., `index.jsx`, `add.jsx`, `edit.jsx`).
  2. Import and register the route in `src/App.jsx` under the protected area if it requires auth.

- To add a component:

  - Place reusable components in `src/components/<category>/` and export from an index file if reused widely.

- To add a new API integration:
  - Put thin fetch-layer helpers in `src/api/` and call `supabase` from `src/config/supabaseClient.ts` for DB operations.

Build / CI notes

- `npm run build` runs `tsc -b` then `vite build`. The `tsc -b` step expects TypeScript configuration files (`tsconfig.json`, `tsconfig.app.json`). Ensure any added `.ts`/`.tsx` files are included in tsconfig or referenced projects.
- There are no unit tests or test runner configured in this repo. Add test tooling deliberately (e.g., Vitest) and CI steps if needed.

What to look for in code reviews

- Environment-variable safety: avoid committing secrets; use `import.meta.env` only and document required keys.
- Usage of `console.log` in `cloudinaryConfig.js` (present today) — these are useful for debug but consider removing or gating behind debug flags before production.
- Mixing `.jsx` and `.tsx`: prefer consistent typing when changing modules that cross boundaries.

Examples (copy-paste)

- Supabase usage (from `src/config/supabaseClient.ts`):

```js
import supabase from "src/config/supabaseClient.ts";
const { data, error } = await supabase.from("students").select("*");
```

- Cloudinary upload usage:

```js
import { uploadImageToCloudinary } from "src/config/cloudinaryConfig.js";
const result = await uploadImageToCloudinary(file);
if (result.success) {
  // use result.url
}
```

Files to inspect for behavior and patterns

- `src/App.jsx` — routing & protected layout
- `src/main.jsx` — app bootstrap and providers
- `src/config/supabaseClient.ts` — supabase client
- `src/config/cloudinaryConfig.js` — upload helper & env usage
- `src/components/ProtectedRoute.jsx` — auth gating
- `package.json` — scripts and dependencies

If anything is missing or unclear

- Tell me which feature you want to modify and I will point to exact files and example diffs.
- If you want stricter typing/codestyle rules, indicate whether to convert `.jsx` files to `.tsx` and update `tsconfig`.

---

Please review these instructions and tell me any unclear or missing parts you want added (examples, routes, or CI steps).
