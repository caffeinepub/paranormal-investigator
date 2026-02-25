import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminEmail: null,
  login: () => {},
  logout: () => {},
});

const SESSION_KEY = 'opi_admin_session';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const { email } = JSON.parse(stored);
        setIsAdmin(true);
        setAdminEmail(email);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback((email: string) => {
    setIsAdmin(true);
    setAdminEmail(email);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setAdminEmail(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, adminEmail, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}
