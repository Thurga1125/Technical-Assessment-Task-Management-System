import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import api, { setAccessToken } from "../lib/api";
import type { User } from "../types";

const REFRESH_URL = `${import.meta.env.VITE_API_URL ?? "http://localhost:3001/api"}/auth/refresh`;

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
  });

  useEffect(() => {
    // Use raw axios (not the api instance) so the response interceptor
    // does NOT fire — avoids the redirect-to-/login reload loop on 401.
    axios
      .post(REFRESH_URL, {}, { withCredentials: true })
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        setState({ user: null, accessToken: data.accessToken, isLoading: false });
      })
      .catch(() => {
        setState({ user: null, accessToken: null, isLoading: false });
      });
  }, []);

  function login(token: string, user: User) {
    setAccessToken(token);
    setState({ user, accessToken: token, isLoading: false });
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setAccessToken(null);
    setState({ user: null, accessToken: null, isLoading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
