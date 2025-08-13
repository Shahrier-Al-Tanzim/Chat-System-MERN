import React, { createContext, useEffect, useMemo, useState } from 'react';
import type { AuthResponse, User } from '../types';

interface AuthContextProps {
  user: User | null;
  token: string | null;
  setAuth: (payload: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('chat_token');
    const u = localStorage.getItem('chat_user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const setAuth = (payload: AuthResponse) => {
    localStorage.setItem('chat_token', payload.token);
    localStorage.setItem('chat_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('chat_token');
    localStorage.removeItem('chat_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, setAuth, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth moved to useAuth.tsx
export { AuthContext };
