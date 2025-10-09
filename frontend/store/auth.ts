import { create } from "zustand";
import api from "@/utils/api";
import { User } from "../types/auth";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import axios from "axios";

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
      // Show success toast
      if (message) {
        toast.success(message);
      }
    } catch (error) {
      let errorMessage = "Login failed";

      // Extract message from axios error response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, loading: false });
      // Show error toast
      toast.error(errorMessage);
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
      // Show success toast
      if (message) {
        toast.success(message);
      }
    } catch (error) {
      let errorMessage = "Registration failed";

      // Extract message from axios error response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, loading: false });
      // Show error toast
      toast.error(errorMessage);
    }
  },

  getAllUsers: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/auth/users");
      const { users } = res.data;
      set({ users, loading: false });
    } catch (error) {
      let errorMessage = "Failed to fetch users";

      // Extract message from axios error response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, loading: false });
      // Show error toast
      toast.error(errorMessage);
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
      // Show success toast
      if (message) {
        toast.success(message);
      }
    } catch (error) {
      let errorMessage = "Role update failed";

      // Extract message from axios error response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({ error: errorMessage, loading: false });
      // Show error toast
      toast.error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, message: "Logged out successfully" });
    // Show success toast
    toast.success("Logged out successfully");
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
