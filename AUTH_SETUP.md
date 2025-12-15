# Supabase Auth Setup Guide

This project includes a production-ready authentication layer using Supabase, React, Vite, and React Router v6.

## 1. Environment Configuration

You must set up your environment variables.
Create a `.env` (or `.env.local`) file in the root of the project:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: using `VITE_` prefix is required for Vite to expose these variables to the client via `import.meta.env`.

## 2. Supabase Dashboard Configuration

### Authentication Providers
1. Go to **Authentication > Providers**.
2. Enable **Email/Password**.
3. Enable **Google** (if using Google OAuth):
   - You need a Google Cloud Platform project.
   - Configure "Authorized redirect URIs" in Google Console to `https://<project-ref>.supabase.co/auth/v1/callback`.
   - Add your Client ID and Secret to Supabase.

### URL Configuration
Go to **Authentication > URL Configuration**.

1. **Site URL**: Set this to your production URL (e.g., `https://my-app.com`). For local development, Supabase usually allows `localhost`.
2. **Redirect URLs**: Add your local and production URLs.
   - `http://localhost:5173/auth/callback` (or your local port)
   - `http://localhost:5173/auth/reset-password` (Strictly speaking, Supabase redirects to the Site URL with a hash, but adding specific paths is good practice if using implicit flow redirects).

**Important**: For the `signInWithOAuth` Google flow, we specified `redirectTo: window.location.origin + '/auth/callback'`. Ensure this URL is whitelisted in Supabase.

### Email Templates
Go to **Authentication > Email Templates**.
- **Confirm Your Signup**: Ensure the link points to your Site URL.
- **Reset Password**: The link usually looks like `{{ .SiteURL }}/auth/callback?token=...` or standard Supabase handling. Usage of the "Reset Password" flow in this app relies on the user landing on the site with the access token, which `supabase-js` detects.

## 3. Project Structure

- **src/main.tsx**: Entry point, wraps App with `AuthProvider` and `BrowserRouter`.
- **src/lib/supabaseClient.ts**: Initializes Supabase client.
- **src/context/AuthContext.tsx**: Provides `user`, `session`, and auth methods (`signIn`, `signOut`, etc.) globally.
- **src/routes/auth/**: Contains Login, Signup, ForgotPassword, ResetPassword pages.
- **src/components/ProtectedRoute.tsx**: Restricts access to authenticated users.

## 4. Usage

### Protect a Route
Wrap your route in `App.tsx`:

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

### Access User Data
In any component:

```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, signOut } = useAuth();
```
