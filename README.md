### Creatrend — Frontend .

Modern React frontend built with Vite, Tailwind CSS v4, Auth0, and React Router. This app powers the portfolio/marketing site plus creator/brand onboarding and dashboards.

## Tech Stack
- **Build Tool**: Vite ^7 (ESM, fast HMR)
- **Framework**: React ^19, React DOM
- **Routing**: React Router DOM ^6
- **Styling**: Tailwind CSS ^4 with `@tailwindcss/vite`
- **Auth**: Auth0 via `@auth0/auth0-react` and custom OAuth helpers
- **HTTP**: Axios
- **UI/UX**: Swiper (carousels), `motion` (animations), `react-icons`
- **Linting**: ESLint ^9 with React Hooks & Refresh plugins

## Getting Started

1) **Clone the Repository**
```bash
git clone https://github.com/imsandeep1073/leads-alpha.git
cd leads-alpha
```

2) **Prerequisites**
- Node.js 18+ and npm 9+

3) **Install Dependencies**
```bash
npm install
```

4) **Environment Variables**
Create a `.env` (or `.env.local`) file in the project root:
```bash
VITE_DOMAIN=your-tenant.eu.auth0.com
VITE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxx
VITE_REDIRECT_URI=http://localhost:5173
# IMPORTANT: Do not expose client secrets in the browser in production
VITE_CLIENT_SECRET=only-for-local-dev-or-move-to-backend
```

5) **Run Dev Server**
```bash
npm run dev
```
Vite will start at `http://localhost:5173`.

6) **Build & Preview**
```bash
npm run build
npm run preview
```

7) **Lint**
```bash
npm run lint
```

## Project Structure

### Overview
```text
.
├─ index.html
├─ netlify.toml                # SPA redirects and build output
├─ vite.config.js              # React + Tailwind plugin config
├─ tailwind.config.js          # Tailwind v4 config (content/theme)
├─ src/
│  ├─ App.jsx                  # App entry used by Vite main
│  ├─ main.jsx                 # React root render
│  ├─ routes/                  # Route configuration
│  │  ├─ index.js             # Main routes aggregator
│  │  ├─ authRoutes.js        # Authentication routes
│  │  ├─ brandRoutes.js       # Brand dashboard routes
│  │  ├─ creatorRoutes.js     # Creator dashboard routes
│  │  └─ portfolioRoutes.js   # Public portfolio routes
│  ├─ services/
│  │  ├─ auth0.js             # Auth0 OAuth helpers
│  │  └─ api/
│  │     ├─ axiosInstance.js  # Configured Axios instance with interceptors
│  │     └─ apiservices.js    # API service functions
│  ├─ components/
│  │  ├─ common/               # Reusable UI primitives
│  │  ├─ Layout/               # Role-based layouts
│  │  │  ├─ BrandLayout/      # Brand dashboard layout
│  │  │  ├─ CreatorLayout/    # Creator dashboard layout
│  │  │  └─ PortfolioLayout.jsx # Public site layout
│  │  └─ portfolio/            # Portfolio site sections
│  ├─ pages/                   # Page components (see detailed structure below)
│  │  ├─ auth/                # Authentication pages
│  │  ├─ brand/               # Brand dashboard pages
│  │  ├─ creator/             # Creator dashboard pages
│  │  ├─ portfolio/           # Public marketing pages
│  │  └─ NotFound.jsx         # 404 page
│  ├─ assets/                  # Images, SVGs, videos
│  └─ utils/
│     └─ countries.json
└─ public/                     # Global styles, static files
```

### Pages Structure Convention

Each page module follows a consistent structure pattern:

```text
pages/
├─ auth/                       # Authentication Module
│  ├─ Login.jsx               # Login page component
│  ├─ SignUp.jsx              # Signup page component
│  ├─ VerifyEmail.jsx         # Email verification page
│  ├─ Callback.jsx            # OAuth callback handler
│  └─ hooks/
│     └─ useAuthHook.js       # Authentication custom hooks
│
├─ brand/                      # Brand Dashboard Module
│  └─ Campaigns/              # Campaigns Feature
│     ├─ index.jsx            # Base campaigns page
│     ├─ components/          # Feature-specific components
│     ├─ hooks/               # Feature-specific hooks (if needed)
│     └─ pages/               # Nested pages
│        └─ CampaignDetails/  # Campaign details sub-page
│           ├─ index.jsx      # Campaign details page
│           ├─ components/    # Sub-page components
│           └─ hooks/         # Sub-page hooks (if needed)
│
├─ creator/                    # Creator Dashboard Module
│  └─ AppliedJobs/            # Applied Jobs Feature
│     ├─ MyJobs.jsx           # Base jobs page
│     ├─ components/          # Feature-specific components
│     └─ hooks/               # Feature-specific hooks (if needed)
│
└─ portfolio/                  # Public Portfolio Module
   ├─ Home.jsx                # Homepage
   ├─ About.jsx               # About page
   └─ ...                     # Other marketing pages
```

### Page Module Pattern

Each feature/page follows this structure:

```text
FeatureName/
├─ index.jsx                   # Main page component (entry point)
├─ components/                 # Components specific to this feature
│  ├─ ComponentA.jsx
│  └─ ComponentB.jsx
├─ hooks/                      # Custom hooks for this feature
│  └─ useFeatureHook.js
└─ pages/                      # Nested sub-pages (if feature has multiple views)
   └─ SubPage/
      ├─ index.jsx
      ├─ components/
      └─ hooks/
```

**Key Principles:**
- `index.jsx` is always the main entry point for a page/feature
- `components/` contains UI components specific to that page
- `hooks/` contains custom React hooks for business logic
- `pages/` is used for nested routing within a feature
- This pattern repeats recursively for nested pages

## Architecture Deep Dive

### Routing System

The application uses a centralized routing configuration with role-based access:

**Route Files Structure:**
```javascript
// src/routes/index.js - Main aggregator
import authRoutes from './authRoutes';
import brandRoutes from './brandRoutes';
import creatorRoutes from './creatorRoutes';
import portfolioRoutes from './portfolioRoutes';

const routes = [
  ...authRoutes,      // /login, /signup, /verify-email, /auth/callback
  ...portfolioRoutes, // /, /about, /blogs, etc.
  ...brandRoutes,     // /brand/* (protected)
  ...creatorRoutes,   // /creator/* (protected)
];
```

**Route Configuration Pattern:**
```javascript
// Example: brandRoutes.js
{
  path: "/brand",
  element: BrandLayout,  // Layout wrapper
  children: [
    {
      index: true,
      element: redirect("/brand/campaigns"),  // Default redirect
    },
    {
      path: "campaigns",
      element: lazy(() => import("../pages/brand/Campaigns")),
    },
    {
      path: "campaigns/:id",
      element: lazy(() => import("../pages/brand/Campaigns/pages/CampaignDetails")),
    },
  ]
}
```

**Role-Based Redirects:**
After authentication, users are redirected based on their role:
- **Brand** → `/brand/campaigns`
- **Creator** → `/creator/my-jobs`
- **Admin** → `/admin/`
- **No Role** → `/signup?step=role` (role selection)

### Layout System

Three main layouts wrap different sections of the app:

**1. PortfolioLayout** (`src/components/Layout/PortfolioLayout.jsx`)
- Used for public marketing pages
- Includes public header, footer, and navigation
- No authentication required

**2. BrandLayout** (`src/components/Layout/BrandLayout/`)
- Used for brand dashboard pages
- Includes brand-specific navigation and sidebar
- Protected routes (requires authentication + brand role)
- Uses `<Outlet />` for nested routes

**3. CreatorLayout** (`src/components/Layout/CreatorLayout/`)
- Used for creator dashboard pages
- Includes creator-specific navigation and sidebar
- Protected routes (requires authentication + creator role)
- Uses `<Outlet />` for nested routes

**Layout Pattern:**
```javascript
// Example: BrandLayout/index.jsx
import { Outlet } from 'react-router-dom';

const BrandLayout = () => {
  return (
    <div className="brand-dashboard">
      <Sidebar />
      <main>
        <Header />
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  );
};
```

### API Services Architecture

**Axios Instance Configuration** (`src/services/api/axiosInstance.js`):
```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request Interceptor - Adds auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handles errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
    }
    return Promise.reject(error);
  }
);
```

**API Service Functions** (`src/services/api/apiservices.js`):
```javascript
// Authentication APIs
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
  return response.data;
};

export const verifyEmail = async (verificationData) => {
  const response = await axios.post(`${API_BASE_URL}/users/verify-email`, verificationData);
  return response.data;
};

// Protected APIs (use axiosInstance for auth token)
export const setUserRole = async (roleData) => {
  const response = await axiosInstance.post('/users/set-role', roleData);
  return response.data;
};
```

**API Service Pattern:**
- **Public APIs**: Use plain `axios` with full URL
- **Protected APIs**: Use `axiosInstance` (auto-adds auth token)
- All API functions are centralized in `apiservices.js`
- Error handling is done via interceptors and try-catch in hooks

### Authentication Flow

**1. Sign Up Flow:**
```
User fills form → POST /users/register
  ↓
Redirect to /verify-email
  ↓
User enters code → POST /users/verify-email
  ↓
Redirect to /signup?step=role
  ↓
User selects role → POST /users/set-role
  ↓
Redirect to role dashboard (/brand/ or /creator/)
```

**2. Login Flow:**
```
User enters credentials → POST /users/login
  ↓
Check response.user.role
  ↓
If role exists → Redirect to dashboard
If role is null → Redirect to /signup?step=role
If email not verified → Redirect to /verify-email
```

**3. Token Management:**
- Auth token stored as `access_token` in localStorage
- Token format: `response.user.auth_token`
- Automatically attached to all protected API requests
- Removed on logout

### Custom Hooks Pattern

**useAuthHook** (`src/pages/auth/hooks/useAuthHook.js`):
```javascript
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => { /* ... */ };
  const signup = async (userData) => { /* ... */ };
  const verifyEmail = async (data) => { /* ... */ };
  const updateRole = async (role) => { /* ... */ };
  const logout = () => { /* ... */ };

  return { user, loading, error, login, signup, verifyEmail, updateRole, logout };
};
```

**Hook Usage in Components:**
```javascript
const MyComponent = () => {
  const { login, loading, error } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };
};
```

## Key Concepts

- **Styling**: Tailwind v4 is wired via `@tailwindcss/vite` in `vite.config.js`. Purge is driven by `content` in `tailwind.config.js`.
- **Assets**: Heavy media content is organized under `src/assets`. Prefer dynamic imports or a CDN for very large files.
- **Code Splitting**: All routes use `lazy()` imports for automatic code splitting and better performance.

## Development Notes

- React 19 removes `createRoot` warnings; use `createRoot` from `react-dom/client` as in `src/main.jsx`.
- Keep environment variables prefixed with `VITE_` to expose them to the client via Vite.
- For Auth callbacks, ensure `VITE_REDIRECT_URI` matches your Auth0 Application settings (Allowed Callback URLs and Allowed Logout URLs).

## Deployment

### Netlify
- `netlify.toml` is preconfigured:
  - **Build command**: `npm run build`
  - **Publish directory**: `dist`
  - **SPA redirect**: all routes → `/index.html` (status 200)
- Set the same environment variables in Netlify’s site settings (without quotes).

### Other Hosts
- Any static host (Vercel, Cloudflare Pages, S3+CloudFront) works. Ensure SPA fallback to `index.html` and environment variables are present at build time.

## Troubleshooting

- **Blank screen after login**: Check `VITE_REDIRECT_URI` and Auth0 Allowed Callback URLs.
- **401/403 on APIs**: Verify token acquisition and attach Authorization headers in Axios wrappers.
- **Styles missing in production**: Confirm `tailwind.config.js` content paths match your file locations.

## Scripts (from package.json)

- `npm run dev`: Start Vite dev server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint

## License

Proprietary — All rights reserved. .
