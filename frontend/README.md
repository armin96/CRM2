# MiniCRM — Frontend Application

Modern, minimalist SPA for MiniCRM built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System (Minimal Light Theme)
- **Kanban Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Charts & Data Visualization**: `recharts`
- **Server State & Caching**: `@tanstack/react-query`
- **Client State & Persistence**: `zustand` with `persist` middleware
- **Routing**: `react-router-dom` (v6) with authenticated route guards
- **HTTP Client**: `axios` with automatic JWT Bearer interceptor & 401 redirect
- **Icons**: `lucide-react`
- **Date Utilities**: `date-fns`

---

## 📁 Directory Structure

```
frontend/src/
├── api/             # Axios instance & typed API endpoints (auth, contacts, deals, emails, dashboard)
├── components/
│   ├── layout/      # AppLayout & collapsible Sidebar navigation
│   └── ui/          # ProtectedRoute and reusable UI elements
├── pages/
│   ├── auth/        # LoginPage & RegisterPage (with demo credentials)
│   ├── contacts/    # ContactsPage (CRUD modal, search, pagination, avatar initials)
│   ├── dashboard/   # DashboardPage (KPI cards, bar charts, donut charts, funnel)
│   ├── emails/      # EmailsPage (Outreach log table, status updater, modal)
│   └── pipeline/    # PipelinePage (6-stage Kanban board with @dnd-kit)
├── store/           # Zustand auth store (token, user, login, logout)
├── types/           # Shared TypeScript interfaces & enums
├── App.tsx          # Router configuration & QueryClientProvider
├── index.css        # Minimalist white design system & token definitions
└── main.tsx         # Application entry point
```

---

## ⚡ Development & Scripts

```bash
# Install dependencies
npm install

# Start local dev server with hot module replacement (HMR)
npm run dev

# Run type check
npx tsc --noEmit

# Production build
npm run build

# Preview production build
npm run preview
```
