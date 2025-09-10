import { create } from "zustand";
import api from "@/utils/api";
import { UserType } from "../types/auth";

interface AuthState {
  user: typeof UserType | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  isInitialized: boolean;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fname: string,
    lname: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
  isInitialized: false,

  initialize: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.post("/auth/login", { email, password });
      const { token, user, message } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, message, loading: false });
    } catch (error) {
      set({ error: "Login failed " + error, loading: false });
    }
  },

  register: async (fname, lname, email, phone, password) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await api.post("/auth/register", {
        fname,
        lname,
        email,
        phone,
        password,
      });
      const { token, user, message } = res.data;
      localStorage.setItem("token", token);
      set({ user, token, message, loading: false });
    } catch (error) {
      set({ error: "Registration failed " + error, loading: false });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, message: "Logged out successfully" });
  },
}));
