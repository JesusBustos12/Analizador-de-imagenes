import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../useAuth';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useAuth Hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('initializes with null user if checkSession fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useAuth());

    // Wait for initialization to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.isInitializing).toBe(false);
    expect(result.current.currentUser).toBeNull();
  });

  it('updates user on successful login', async () => {
    const mockUser = { id: '1', name: 'Oficial', email: 'test@gob.com' };
    
    // First fetch is for checkSession on mount
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useAuth());

    // Mock successful login response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser }),
    });

    await act(async () => {
      const response = await result.current.login('test@gob.com', 'password123');
      expect(response.success).toBe(true);
    });

    expect(result.current.currentUser).toEqual(mockUser);
  });
});
