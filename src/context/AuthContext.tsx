import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  register: (name: string, email: string, role: UserRole, phone?: string) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  toggleSaveDestination: (destId: string) => void;
  toggleSaveBusiness: (bizId: string) => void;
  isDestinationSaved: (destId: string) => boolean;
  isBusinessSaved: (bizId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'localora_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Tourist (Aditi Rao) for initial delightful exploration experience
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load user session', e);
    }
    return DEMO_USERS.tourist;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, preferredRole?: UserRole): boolean => {
    // Check if matching demo user exists
    const foundDemo = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundDemo) {
      setUser(foundDemo);
      return true;
    }

    // Otherwise create or sign in with preferred role
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: preferredRole || 'tourist',
      savedDestinations: [],
      savedBusinesses: [],
      savedItineraries: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const register = (name: string, email: string, role: UserRole, phone?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      phone,
      avatar: `https://images.unsplash.com/photo-${role === 'business_owner' ? '1507003211169-0a1dd7228f2d' : '1534528741775-53994a69daeb'}?w=150&auto=format&fit=crop&q=80`,
      businessId: role === 'business_owner' ? `biz-${Date.now()}` : undefined,
      savedDestinations: [],
      savedBusinesses: [],
      savedItineraries: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchUserRole = (targetRole: UserRole) => {
    const demo = DEMO_USERS[targetRole];
    if (demo) {
      setUser(demo);
    }
  };

  const toggleSaveDestination = (destId: string) => {
    if (!user) return;
    const exists = user.savedDestinations.includes(destId);
    const updated = exists
      ? user.savedDestinations.filter((id) => id !== destId)
      : [...user.savedDestinations, destId];

    setUser({
      ...user,
      savedDestinations: updated,
    });
  };

  const toggleSaveBusiness = (bizId: string) => {
    if (!user) return;
    const exists = user.savedBusinesses.includes(bizId);
    const updated = exists
      ? user.savedBusinesses.filter((id) => id !== bizId)
      : [...user.savedBusinesses, bizId];

    setUser({
      ...user,
      savedBusinesses: updated,
    });
  };

  const isDestinationSaved = (destId: string) => {
    return Boolean(user?.savedDestinations.includes(destId));
  };

  const isBusinessSaved = (bizId: string) => {
    return Boolean(user?.savedBusinesses.includes(bizId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'tourist',
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        switchUserRole,
        toggleSaveDestination,
        toggleSaveBusiness,
        isDestinationSaved,
        isBusinessSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
