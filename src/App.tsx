import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Dashboard from './routes/Dashboard';
import Login from './routes/auth/Login';
import Signup from './routes/auth/Signup';
import ForgotPassword from './routes/auth/ForgotPassword';
import ResetPassword from './routes/auth/ResetPassword';
import Callback from './routes/auth/Callback';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
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
                <Route path="/dashboard" element={<Dashboard />} />
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
    );
}

export default App;
