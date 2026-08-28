import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should initialize with null token and user', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated()).toBe(false);
  });

  it('should set token and user on login', () => {
    const mockUser = { id: 1, email: 'alex@example.com', fullName: 'Alex Johnson' };
    useAuthStore.getState().login('mock-jwt-token', mockUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe('mock-jwt-token');
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated()).toBe(true);
  });

  it('should reset state on logout', () => {
    useAuthStore.getState().login('mock-token', { id: 1, email: 'test@example.com', fullName: 'Test' });
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });
});
