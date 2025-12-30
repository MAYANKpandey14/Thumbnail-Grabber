import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function Callback() {
    const navigate = useNavigate();
    const { session, loading, error: authError } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (loading) return;

        // Check for error in URL (Supabase OAuth redirect strategy)
        const params = new URLSearchParams(location.hash.substring(1)); // Hashes often contain the access_token or error
        const errorDescription = params.get('error_description');
        const error = params.get('error');

        if (error || errorDescription || authError) {
            // In a real app, you might want to show this error to the user on a dedicated page or via toast before redirecting
            // For now, redirect to login with error state
            console.error("Auth Callback Error:", error, errorDescription, authError);
            navigate('/auth/login', { state: { error: errorDescription || error || authError?.message } });
            return;
        }

        if (session) {
            navigate('/dashboard');
        } else {
            // Fallback if no session and no error (shouldn't happen often if we wait for loading)
            navigate('/auth/login');
        }
    }, [session, loading, navigate, location, authError]);

    return (
        <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Verifying authentication...</span>
        </div>
    );
}
