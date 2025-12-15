import { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

// --- 1. Standardized Error Shape ---
export type AuthError = {
    code: string;
    message: string;
};

// --- 2. Safe Logging Utility ---
const IS_PROD = import.meta.env.PROD;

/**
 * Logs auth events without revealing sensitive data.
 * NEVER logs passwords or full tokens.
 */
export const safeLogAuth = (action: string, details?: any) => {
    if (IS_PROD) return; // Optional: suppress logs entirely in prod or send to observability service

    // SCRUB SENSITIVE DATA
    const safeDetails = { ...details };

    // Redact common sensitive fields
    if (safeDetails.password) safeDetails.password = '[REDACTED]';
    if (safeDetails.token) safeDetails.token = `${safeDetails.token.substring(0, 6)}...[REDACTED]`;
    if (safeDetails.accessToken) safeDetails.accessToken = `${safeDetails.accessToken.substring(0, 6)}...[REDACTED]`;
    if (safeDetails.refreshToken) safeDetails.refreshToken = `...[REDACTED]`;

    console.log(`[AUTH] ${action}`, safeDetails);
};

// --- 3. Error Mapper ---
export const mapErrorToAuthError = (error: unknown): AuthError => {
    // unknown error fallback
    const defaultError: AuthError = {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred. Please try again.',
    };

    if (!error) return defaultError;

    if (typeof error === 'object' && 'message' in error) {
        const sbError = error as SupabaseAuthError;
        const msg = sbError.message.toLowerCase();

        // Map common Supabase errors to standardized codes
        if (msg.includes('invalid login credentials')) {
            return { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };
        }
        if (msg.includes('user already registered') || msg.includes('unique constraint')) {
            return { code: 'EMAIL_ALREADY_REGISTERED', message: 'This email is already registered.' };
        }
        if (msg.includes('rate limit')) {
            return { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later.' };
        }
        if (msg.includes('email not confirmed')) {
            return { code: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email address before logging in.' };
        }
        if (msg.includes('weak password')) {
            return { code: 'WEAK_PASSWORD', message: 'Password is too weak. Please choose a stronger password.' };
        }

        // Return the original message for other known Supabase errors, but keep it clean
        return {
            code: (sbError.code || 'AUTH_ERROR').toUpperCase(),
            message: sbError.message,
        };
    }

    return defaultError;
};
