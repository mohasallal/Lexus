import api from "@/utils/api";
import { create } from "zustand";
import { TimeSlot } from "@/types/timeslots";
import { socket } from "@/lib/socket";

interface TimeSlotsState {
  timeSlots: TimeSlot[] | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  createTimeSlot: (
    activityId: number,
    startTime: string,
    endTime: string,
    maxParticipants: number
  ) => Promise<void>;
  getTimeSlots: () => Promise<void>;
  getTimeSlotById: (id: number) => Promise<TimeSlot | null>;
  getTimeSlotsByActivity: (activityId: number) => Promise<TimeSlot[] | null>;
  updateTimeSlot: (
    id: number,
    activityId: number,
    startTime: string,
    endTime: string,
    maxParticipants: number
  ) => Promise<void>;
  deleteTimeSlot: (id: number) => Promise<void>;
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

export const useTimeSlotsStore = create<TimeSlotsState>((set) => ({
  timeSlots: null,
  loading: false,
  error: null,
  message: null,

  createTimeSlot: async (activityId, startTime, endTime, maxParticipants) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.post("/time/create", {
        activityId,
        startTime,
        endTime,
        maxParticipants,
      });
      validateResponse(res, "slot");
      const newTimeSlot = res.data.slot;
      set((state) => ({
        timeSlots: state.timeSlots
          ? [...state.timeSlots, newTimeSlot]
          : [newTimeSlot],
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
  getTimeSlots: async () => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get("/time/all");
      validateResponse(res, "timeSlots");
      set({ timeSlots: res.data.timeSlots, error: null });
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
  getTimeSlotById: async (id) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get(`/time/${id}`);
      validateResponse(res, "slot");
      return res.data.slot;
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
  getTimeSlotsByActivity: async (activityId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get(`/time/activity/${activityId}`);
      validateResponse(res, "timeSlots");
      return res.data.timeSlots;
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
  updateTimeSlot: async (
    id,
    activityId,
    startTime,
    endTime,
    maxParticipants
  ) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.put(`/time/update/${id}`, {
        activityId,
        startTime,
        endTime,
        maxParticipants,
      });
      validateResponse(res, "slot");
      const updatedTimeSlot = res.data.slot;
      set((state) => ({
        timeSlots: state.timeSlots
          ? state.timeSlots.map((timeSlot) =>
              timeSlot.id === id ? updatedTimeSlot : timeSlot
            )
          : [updatedTimeSlot],
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
  deleteTimeSlot: async (id) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.delete(`/time/delete/${id}`);
      validateResponse(res, "message");
      set((state) => ({
        timeSlots: state.timeSlots
          ? state.timeSlots.filter((timeSlot) => timeSlot.id !== id)
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

  initializeSocketListeners: () => {
    // Remove existing listeners to prevent duplicates
    socket.off("timeSlotCreated");
    socket.off("timeSlotUpdated");
    socket.off("timeSlotDeleted");

    // Add fresh listeners
    socket.on("timeSlotCreated", (newTimeSlot: TimeSlot) => {
      set((state) => ({
        timeSlots: state.timeSlots
          ? [...state.timeSlots, newTimeSlot]
          : [newTimeSlot],
      }));
    });

    socket.on("timeSlotUpdated", (updatedTimeSlot: TimeSlot) => {
      set((state) => ({
        timeSlots: state.timeSlots
          ? state.timeSlots.map((timeSlot) =>
              timeSlot.id === updatedTimeSlot.id ? updatedTimeSlot : timeSlot
            )
          : [updatedTimeSlot],
      }));
    });

    socket.on("timeSlotDeleted", ({ id }: { id: number }) => {
      set((state) => ({
        timeSlots: state.timeSlots
          ? state.timeSlots.filter((timeSlot) => timeSlot.id !== id)
          : null,
      }));
    });
  },
}));
