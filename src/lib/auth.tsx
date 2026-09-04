import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_USER } from "./mock-data";

const KEY = "kvp_admin_session";

interface AuthValue {
  ready: boolean;
  isAuthed: boolean;
  email: string | null;
  login: (email: string, password: string, remember: boolean) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
      if (stored) setEmail(stored);
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  const login = (e: string, p: string, remember: boolean) => {
    if (e.trim().toLowerCase() !== DEMO_USER.email || p !== DEMO_USER.password) {
      return "Invalid credentials. Use the demo login shown below.";
    }
    setEmail(DEMO_USER.email);
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, DEMO_USER.email);
    } catch {
      /* ignore */
    }
    return null;
  };

  const logout = () => {
    setEmail(null);
    try {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthContext.Provider value={{ ready, isAuthed: !!email, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
