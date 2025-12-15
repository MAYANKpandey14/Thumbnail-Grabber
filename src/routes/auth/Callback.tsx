import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function Callback() {
    const navigate = useNavigate();
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            navigate('/dashboard');
        } else {
            // If no session is found after a short delay (auth processing), redirect to login
            const timer = setTimeout(() => {
                navigate('/auth/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [session, navigate]);

    return (
        <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Verifying authentication...</span>
        </div>
    );
}
