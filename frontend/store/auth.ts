import { create } from "zustand";
import api from "@/utils/api";
import { User } from "../types/auth";
import { socket } from "@/lib/socket";

interface AuthState {
  user: User | null;
  users: User[] | null;
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
    phone: string
  ) => Promise<void>;
  getAllUsers: () => Promise<void>;
  updateRole: (id: number, role: "USER" | "SUPERVISOR") => Promise<void>;
  logout: () => void;
  initializeSocketListeners: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  users: null,
  token: null,
  loading: false,
  error: null,
  message: null,
  isInitialized: false,

  initialize: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        set({ token, user, isInitialized: true });
      } catch (error) {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isInitialized: true,
          error: "" + error,
        });
      }
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

  register: async (fname, lname, email, phone) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await api.post("/auth/register", {
        fname,
        lname,
        email,
        phone,
      });
      const { message } = res.data;
      set({ message, loading: false });
    } catch (error) {
      set({ error: "Registration failed " + error, loading: false });
    }
  },

  getAllUsers: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/auth/users");
      const { users } = res.data;
      set({ users, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch users " + error, loading: false });
    }
  },

  updateRole: async (id, role) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.put("/auth/role", { id, role });
      const { user, message } = res.data;
      set({ message, loading: false });
      set((state) => ({
        user: state.user?.id === id ? user : state.user,
      }));
    } catch (error) {
      set({ error: "Role update failed " + error, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, message: "Logged out successfully" });
  },

  initializeSocketListeners: () => {
    // Remove existing listeners to prevent duplicates
    socket.off("userCreated");

    // Add fresh listeners
    socket.on("userCreated", (newUser: User) => {
      set((state) => ({
        users: state.users ? [...state.users, newUser] : [newUser],
      }));
    });
  },
}));
