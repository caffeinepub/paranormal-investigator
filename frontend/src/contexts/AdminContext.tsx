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

// Use both sessionStorage (tab-scoped) and localStorage (persistent across refreshes)
const SESSION_KEY = 'opi_admin_session';

function readStoredSession(): { email: string } | null {
  try {
    const fromSession = sessionStorage.getItem(SESSION_KEY);
    if (fromSession) return JSON.parse(fromSession);
    const fromLocal = localStorage.getItem(SESSION_KEY);
    if (fromLocal) return JSON.parse(fromLocal);
  } catch {
    // ignore parse errors
  }
  return null;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize synchronously from storage to avoid flash of unauthenticated state
    const stored = readStoredSession();
    return !!stored?.email;
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    const stored = readStoredSession();
    return stored?.email ?? null;
  });

  // Also sync on mount in case storage changed in another tab
  useEffect(() => {
    const stored = readStoredSession();
    if (stored?.email) {
      setIsAdmin(true);
      setAdminEmail(stored.email);
    }
  }, []);

  const login = useCallback((email: string) => {
    const payload = JSON.stringify({ email });
    // Write to both storages FIRST (synchronously) before updating React state
    // so that ProtectedRoute's storage check sees the session immediately
    sessionStorage.setItem(SESSION_KEY, payload);
    localStorage.setItem(SESSION_KEY, payload);
    setIsAdmin(true);
    setAdminEmail(email);
  }, []);

  const logout = useCallback(() => {
    // Clear both storage locations
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
    setAdminEmail(null);
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
