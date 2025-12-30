import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from '../Login';
import { useAuth } from '../../../hooks/useAuth';

// Mock dependencies
vi.mock('../../../hooks/useAuth');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('Login Component', () => {
    const mockNavigate = vi.fn();
    const mockUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    });

    it('renders login form when not logged in', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            signInWithPassword: vi.fn(),
            signInWithGoogle: vi.fn(),
            // Intentional: loading false
            loading: false
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    // The Issue: It redirects even if loading is potentially true or user is not fully confirmed?
    // Actually the issue is premature redirection. 
    // Let's test checking that we don't redirect if we are in a transitive state.

    it('should NOT redirect if loading is true', () => {
        mockUseAuth.mockReturnValue({ user: { id: '1' }, loading: true });
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        // The current implementation probably waits for user check in useEffect.
        // If loading is true, we might render the form, or we might just do nothing.
        // We want to ensure we don't erroneously redirect if the state isn't settled? 
        // Actually, if user IS present, we DO want to redirect.

        // Wait for useEffect
        // Check that we DO NOT redirect while loading
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should redirect if user is present and not loading', () => {
        mockUseAuth.mockReturnValue({ user: { id: '1' }, loading: false });
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    // New TEST for FIX: Ensure we don't redirect if user is present BUT we are still loading initial session checks?
    // Actually, if user object is present, we are usually good. 
    // The issue description says: "redirects to dashboard before Sign In is confirmed".
    // This implies `user` object might be present in a partial state or the Callback is redirecting too early.
});
