'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  twoFactorEnabled?: boolean;
}

export interface Permission {
  id: string;
  featureKey: string;
  status: string;
  grantedAt: string;
  expiresAt?: string;
  grantedByName?: string;
}

export interface AdminScope {
  featureKey: string;
  canApprove: boolean;
  canRevoke: boolean;
}

interface AuthContextType {
  user: User | null;
  permissions: Permission[];
  adminScopes: AdminScope[];
  unreadNotifications: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasFeature: (featureKey: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [adminScopes, setAdminScopes] = useState<AdminScope[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const data = await fetchApi('/auth/me');
      if (data?.user) {
        setUser(data.user);
        setPermissions(data.permissions || []);
        setAdminScopes(data.adminScopes || []);
        setUnreadNotifications(data.unreadNotifications || 0);
        localStorage.setItem('trackops_user', JSON.stringify(data.user));
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('trackops_token');
      localStorage.removeItem('trackops_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res?.token && res?.user) {
        localStorage.setItem('trackops_token', res.token);
        localStorage.setItem('trackops_user', JSON.stringify(res.user));
        setUser(res.user);
        await refreshProfile();
        return { success: true, role: res.user.role };
      }
      return { success: false, error: 'Login response invalid.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (res?.token && res?.user) {
        localStorage.setItem('trackops_token', res.token);
        localStorage.setItem('trackops_user', JSON.stringify(res.user));
        setUser(res.user);
        await refreshProfile();
        return { success: true };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('trackops_token');
    localStorage.removeItem('trackops_user');
    setUser(null);
    setPermissions([]);
    setAdminScopes([]);
    router.push('/login');
  };

  const hasFeature = (featureKey: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true; // Super Admin has platform-wide authority
    return permissions.some(
      (p) =>
        p.featureKey === featureKey &&
        p.status === 'APPROVED' &&
        (!p.expiresAt || new Date(p.expiresAt) > new Date())
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        adminScopes,
        unreadNotifications,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        hasFeature,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
