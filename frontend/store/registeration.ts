import { create } from "zustand";
import api from "@/utils/api";
import { Registration } from "@/types/registration";
import { socket } from "@/lib/socket";

interface RegisteredUserData {
  regId: number;
  userName: string;
  userEmail: string;
  userPhone?: string;
}

interface RegistrationsState {
  registrations: Registration[] | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  createRegistration: (userId: number, timeSlotId: number) => Promise<void>;
  getAllRegistrations: () => Promise<void>;
  getRegistrationById: (id: number) => Promise<Registration | null>;
  getRegistrationsByUserId: (userId: number) => Promise<Registration[] | null>;
  getRegistrationByTimeSlot: (
    timeSlotId: number
  ) => Promise<Registration[] | null>;
  getRegistrationsByActivityTimeSlot: (
    activityId: number,
    timeSlotId: number
  ) => Promise<RegisteredUserData[] | null>;
  deleteRegistration: (id: number) => Promise<void>;
  initializeSocketListeners: () => void;
}

const validateResponse = (
  response: { data?: Record<string, unknown> },
  expectedProperty: string
) => {
  if (!response?.data || !response.data.hasOwnProperty(expectedProperty)) {
    throw new Error(`Invalid API response: missing ${expectedProperty}`);
  }
};

export const useRegStore = create<RegistrationsState>((set) => ({
  registrations: null,
  loading: false,
  error: null,
  message: null,

  createRegistration: async (userId, timeSlotId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.post("/reg/create", { userId, timeSlotId });
      validateResponse(res, "registration");
      const newRegistration = res.data.registration;
      set((state) => ({
        registrations: state.registrations
          ? [...state.registrations, newRegistration]
          : [newRegistration],
        message: res.data.message,
        error: null,
      }));
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, message: null });
    } finally {
      set({ loading: false });
    }
  },

  getAllRegistrations: async () => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get("/reg/all");
      validateResponse(res, "registrations");
      set({ registrations: res.data.registrations, error: null });
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  getRegistrationById: async (id) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get(`/reg/${id}`);
      validateResponse(res, "registration");
      return res.data.registration;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getRegistrationsByUserId: async (userId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get(`/reg/user/${userId}`);
      validateResponse(res, "registrations");
      return res.data.registrations;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getRegistrationByTimeSlot: async (timeSlotId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get(`/reg/timeslot/${timeSlotId}`);
      validateResponse(res, "registrations");
      return res.data.registrations;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  deleteRegistration: async (id) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.delete(`/reg/delete/${id}`);
      validateResponse(res, "message");
      set((state) => ({
        registrations: state.registrations
          ? state.registrations.filter((registration) => registration.id !== id)
          : null,
        message: res.data.message,
        error: null,
      }));
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },

  getRegistrationsByActivityTimeSlot: async (activityId, timeSlotId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get(
        `/reg/activity/${activityId}/timeslot/${timeSlotId}`
      );
      validateResponse(res, "registrations");
      return res.data.registrations;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  initializeSocketListeners: () => {
    // Remove existing listeners to prevent duplicates
    socket.off("registration:created");
    socket.off("registration:deleted");
    socket.off("registration:update");

    // Add fresh listeners
    socket.on("registration:created", (newReg: Registration) => {
      console.log("🎉 Frontend received registration:created:", newReg);
      set((state) => ({
        registrations: state.registrations
          ? [...state.registrations, newReg]
          : [newReg],
      }));
    });

    socket.on("registration:deleted", ({ id }: { id: number }) => {
      console.log("🗑️ Frontend received registration:deleted for ID:", id);
      set((state) => ({
        registrations: state.registrations
          ? state.registrations.filter((r) => r.id !== id)
          : null,
      }));
    });

    socket.on("registration:update", (updatedRegs: Registration[]) => {
      console.log("📝 Frontend received registration:update:", updatedRegs);
      set({ registrations: updatedRegs });
    });
  },
}));
