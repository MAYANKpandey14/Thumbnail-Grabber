import { Navigate, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home from './routes/Home'; // Keep Home eager for faster LCP
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load other routes
const Dashboard = lazy(() => import('./routes/Dashboard'));
const History = lazy(() => import('./routes/dashboard/History'));
const Folders = lazy(() => import('./routes/dashboard/Folders'));
const FolderDetails = lazy(() => import('./routes/dashboard/FolderDetails'));

const AuthLayout = lazy(() => import('./components/auth/AuthLayout'));
const Login = lazy(() => import('./routes/auth/Login'));
const Signup = lazy(() => import('./routes/auth/Signup'));
const ForgotPassword = lazy(() => import('./routes/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./routes/auth/ResetPassword'));
const Callback = lazy(() => import('./routes/auth/Callback'));

function App() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <Routes>
                <Route path="/" element={<Home />} />

                {/* Auth Routes */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="callback" element={<Callback />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route index element={<Navigate to="history" replace />} />
                        <Route path="history" element={<History />} />
                        <Route path="folders" element={<Folders />} />
                        <Route path="folders/:folderId" element={<FolderDetails />} />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">404</h1>
                            <p>Page not found</p>
                        </div>
                    </div>
                } />
            </Routes>
        </Suspense>
    );
}

export default App;
