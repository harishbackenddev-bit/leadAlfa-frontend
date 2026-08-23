import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { forgotPassword, resetPassword } from './apiservices';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe('forgotPassword API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should POST email to forgot-password endpoint on success', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'If an account with that email exists, a reset link has been sent.' },
    });

    const result = await forgotPassword({ email: 'user@example.com' });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users/forgot-password'),
      { email: 'user@example.com' }
    );
    expect(result.message).toContain('reset link has been sent');
  });

  it('should throw validation error with status on 400 response', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [{ field: 'email', message: 'Valid email is required' }],
        },
      },
    });

    await expect(forgotPassword({ email: 'bad' })).rejects.toMatchObject({
      status: 400,
      errors: [{ field: 'email', message: 'Valid email is required' }],
    });
  });

  it('should throw rate limit error with status on 429 response', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 429,
        data: {
          error: 'Too many password reset attempts. Please try again after 15 minutes.',
        },
      },
    });

    await expect(forgotPassword({ email: 'user@example.com' })).rejects.toMatchObject({
      status: 429,
      error: expect.stringContaining('Too many password reset attempts'),
    });
  });
});

describe('resetPassword API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should POST token and newPassword to reset-password endpoint on success', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Password has been reset successfully. Please log in again.' },
    });

    const payload = {
      token: 'a'.repeat(64),
      newPassword: 'NewSecurePass123',
    };
    const result = await resetPassword(payload);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/users/reset-password'),
      payload
    );
    expect(result.message).toContain('reset successfully');
  });

  it('should throw invalid token error with status on 400 response', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { error: 'Invalid or expired reset token' },
      },
    });

    await expect(
      resetPassword({ token: 'expired', newPassword: 'NewSecurePass123' })
    ).rejects.toMatchObject({
      status: 400,
      error: 'Invalid or expired reset token',
    });
  });

  it('should throw validation error with status for short password', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [{ field: 'newPassword', message: 'Password must be at least 8 characters' }],
        },
      },
    });

    await expect(
      resetPassword({ token: 'a'.repeat(64), newPassword: 'short' })
    ).rejects.toMatchObject({
      status: 400,
      errors: [{ field: 'newPassword', message: 'Password must be at least 8 characters' }],
    });
  });
});
