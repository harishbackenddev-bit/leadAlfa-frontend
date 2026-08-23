import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import authReducer from '../../store/slices/authSlice';

const mockForgotPassword = vi.fn();
const mockResetPassword = vi.fn();
const mockNavigate = vi.fn();

vi.mock('./hooks/useAuthHook', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      forgotPassword: mockForgotPassword,
      resetPassword: mockResetPassword,
      loading: false,
    }),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (ui, { route = '/' } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('ForgotPassword page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render email form', () => {
    renderWithProviders(<ForgotPassword />);

    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('should show generic success banner after successful submit', async () => {
    mockForgotPassword.mockResolvedValueOnce({ message: 'ok' });
    const user = userEvent.setup();

    renderWithProviders(<ForgotPassword />);

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith({ email: 'user@example.com' });
    });

    expect(
      screen.getByText(/if an account with that email exists/i)
    ).toBeInTheDocument();
  });

  it('should show inline validation error on 400 response', async () => {
    mockForgotPassword.mockRejectedValueOnce({
      status: 400,
      errors: [{ field: 'email', message: 'Valid email is required' }],
    });
    const user = userEvent.setup();

    renderWithProviders(<ForgotPassword />);

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(await screen.findByText('Valid email is required')).toBeInTheDocument();
  });

  it('should show dismissible banner on 429 response', async () => {
    mockForgotPassword.mockRejectedValueOnce({
      status: 429,
      error: 'Too many password reset attempts. Please try again after 15 minutes.',
    });
    const user = userEvent.setup();

    renderWithProviders(<ForgotPassword />);

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(
      await screen.findByText(/too many password reset attempts/i)
    ).toBeInTheDocument();
  });
});

describe('ResetPassword page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show error state when token is missing from URL', () => {
    renderWithProviders(<ResetPassword />, { route: '/reset-password' });

    expect(
      screen.getByText(/invalid or missing reset link/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /request a new link/i })
    ).toBeInTheDocument();
  });

  it('should reject mismatched passwords before API call', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ResetPassword />, {
      route: `/reset-password?token=${'a'.repeat(64)}`,
    });

    await user.type(screen.getByLabelText(/^new password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm new password/i), 'Different123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('should show success message after successful reset', async () => {
    mockResetPassword.mockResolvedValueOnce({
      message: 'Password has been reset successfully. Please log in again.',
    });
    const user = userEvent.setup();
    const token = 'b'.repeat(64);

    renderWithProviders(<ResetPassword />, {
      route: `/reset-password?token=${token}`,
    });

    await user.type(screen.getByLabelText(/^new password$/i), 'NewSecurePass123');
    await user.type(screen.getByLabelText(/confirm new password/i), 'NewSecurePass123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(await screen.findByText(/your password has been reset/i)).toBeInTheDocument();
    expect(mockResetPassword).toHaveBeenCalledWith({
      token,
      newPassword: 'NewSecurePass123',
    });
  });

  it('should show invalid token state when API returns expired token error', async () => {
    mockResetPassword.mockRejectedValueOnce({
      status: 400,
      error: 'Invalid or expired reset token',
    });
    const user = userEvent.setup();

    renderWithProviders(<ResetPassword />, {
      route: `/reset-password?token=${'c'.repeat(64)}`,
    });

    await user.type(screen.getByLabelText(/^new password$/i), 'NewSecurePass123');
    await user.type(screen.getByLabelText(/confirm new password/i), 'NewSecurePass123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(
      await screen.findByText(/invalid or has expired/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /request a new link/i })
    ).toBeInTheDocument();
  });
});
