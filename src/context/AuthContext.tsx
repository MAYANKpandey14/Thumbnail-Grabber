import { createContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, SignUpWithPasswordCredentials, SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { AuthError, mapErrorToAuthError, safeLogAuth } from '../lib/auth-security';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: AuthError | null;
    signUp: (data: SignUpWithPasswordCredentials) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
    signInWithPassword: (data: SignInWithPasswordCredentials) => Promise<{ data: { user: User | null; session: Session | null }; error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ data: { provider: string; url: string | null } | null; error: AuthError | null }>; // Adjusted return type to handle potential null data
    signOut: () => Promise<void>;
    requestPasswordReset: (email: string, redirectTo: string) => Promise<{ error: null }>; // Always succeeds from UI perspective
    resetPassword: (password: string) => Promise<{ data: { user: User | null } | null; error: AuthError | null }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AuthError | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Supabase reads session from localStorage by default
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setSession(session);
                setUser(session?.user ?? null);
            } catch (err) {
                // We don't necessarily want to expose initialization errors to the user UI loop immediately, 
                // but we map it just in case we use it.
                setError(mapErrorToAuthError(err));
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Subscribing to auth state changes to keep React state in sync with browser storage
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            safeLogAuth(`AUTH_STATE_CHANGE: ${event}`);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signUp = async (credentials: SignUpWithPasswordCredentials) => {
        const email = 'email' in credentials ? credentials.email : undefined;
        safeLogAuth('SIGNUP_ATTEMPT', { email });
        const { data, error } = await supabase.auth.signUp(credentials);

        if (error) {
            safeLogAuth('SIGNUP_ERROR', { code: error.code });
            const mappedError = mapErrorToAuthError(error);
            // Don't set global error state for individual actions, return it to caller
            return { data, error: mappedError };
        }

        safeLogAuth('SIGNUP_SUCCESS', { userId: data.user?.id });
        return { data, error: null };
    };

    const signInWithPassword = async (credentials: SignInWithPasswordCredentials) => {
        // SECURITY Policy: Never log raw passwords
        const email = 'email' in credentials ? credentials.email : undefined;
        safeLogAuth('LOGIN_ATTEMPT', { email });
        const { data, error } = await supabase.auth.signInWithPassword(credentials);

        if (error) {
            safeLogAuth('LOGIN_ERROR', { code: error.code });
            const mappedError = mapErrorToAuthError(error);
            return { data, error: mappedError };
        }

        safeLogAuth('LOGIN_SUCCESS', { userId: data.user?.id });
        return { data, error: null };
    };

    const signInWithGoogle = async () => {
        safeLogAuth('OAUTH_GOOGLE_INIT');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            safeLogAuth('OAUTH_GOOGLE_ERROR', { code: error.code });
            return { data: null, error: mapErrorToAuthError(error) };
        }

        return { data, error: null };
    };

    const signOut = async () => {
        try {
            safeLogAuth('SIGNOUT_ATTEMPT');
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            safeLogAuth('SIGNOUT_SUCCESS');
        } catch (err) {
            safeLogAuth('SIGNOUT_ERROR');
            setError(mapErrorToAuthError(err));
        }
    };

    const requestPasswordReset = async (email: string, redirectTo: string) => {
        safeLogAuth('REQUEST_PASSWORD_RESET_INIT', { email });

        try {
            // Force HTTPS in production for reset link
            const safeRedirect = import.meta.env.PROD ? redirectTo.replace('http:', 'https:') : redirectTo;

            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: safeRedirect });

            if (error) {
                // INTERNAL LOG: Log the specific error for debugging
                safeLogAuth('REQUEST_PASSWORD_RESET_ERROR', { unmaskedCode: error.code, message: error.message });
                // DATA PRIVACY: Do NOT raise this error to the UI. Prevent enumeration.
            } else {
                safeLogAuth('REQUEST_PASSWORD_RESET_SENT');
            }
        } catch (err) {
            safeLogAuth('REQUEST_PASSWORD_RESET_EXCEPTION', { err });
        }

        // ALWAYS return success/null error to the client
        return { error: null };
    };

    const resetPassword = async (password: string) => {
        // SECURITY: Never log the new password
        safeLogAuth('UPDATE_PASSWORD_ATTEMPT');
        const { data, error } = await supabase.auth.updateUser({ password });

        if (error) {
            safeLogAuth('UPDATE_PASSWORD_ERROR', { code: error.code });
            return { data: null, error: mapErrorToAuthError(error) };
        }

        safeLogAuth('UPDATE_PASSWORD_SUCCESS');
        return { data: { user: data.user }, error: null };
    };

    const value = {
        user,
        session,
        loading,
        error,
        signUp,
        signInWithPassword,
        signInWithGoogle,
        signOut,
        requestPasswordReset,
        resetPassword
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
