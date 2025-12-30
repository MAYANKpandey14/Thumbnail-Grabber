import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import Callback from '../Callback';
import { useAuth } from '../../../hooks/useAuth';

// Mock dependencies
vi.mock('../../../hooks/useAuth');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useLocation: vi.fn(),
    };
});

describe('Callback Component', () => {
    const mockNavigate = vi.fn();
    const mockUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;
    const mockLocation = { hash: '', state: {} };

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
        (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockLocation);
    });

    it('renders loading state initially', () => {
        mockUseAuth.mockReturnValue({ session: null, loading: true });
        render(<Callback />);
        expect(screen.getByText(/verifying/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('redirects to dashboard when session exists and not loading', () => {
        mockUseAuth.mockReturnValue({ session: { user: { id: '1' } }, loading: false });
        render(<Callback />);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('redirects to login immediately if no session and not loading', () => {
        mockUseAuth.mockReturnValue({ session: null, loading: false });
        render(<Callback />);
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    });

    it('redirects to login with error params if error logic triggers', () => {
        // Mock location with error hash
        (useLocation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            hash: '#error=access_denied&error_description=User%20denied%20access',
            pathname: '/auth/callback',
            search: '',
            state: null,
            key: 'default'
        });

        mockUseAuth.mockReturnValue({ session: null, loading: false });
        render(<Callback />);
        expect(mockNavigate).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
            state: expect.objectContaining({ error: 'User denied access' })
        }));
    });
});
