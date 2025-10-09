import { create } from "zustand";
import api from "@/utils/api";
import { Activity } from "@/types/activities";
import { socket } from "@/lib/socket";

interface ActivitiesState {
  activities: Activity[] | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  createActivity: (name: string, description: string) => Promise<void>;
  getActivities: () => Promise<void>;
  getActivityById: (id: number) => Promise<Activity | null>;
  updateActivity: (
    id: number,
    name: string,
    description: string
  ) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
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

export const useActivitiesStore = create<ActivitiesState>((set) => ({
  activities: null,
  loading: false,
  error: null,
  message: null,

  createActivity: async (name, description) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.post("/activities/create", { name, description });
      validateResponse(res, "activity");
      const newActivity = res.data.activity;
      set((state) => ({
        activities: state.activities
          ? [...state.activities, newActivity]
          : [newActivity],
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
  getActivities: async () => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get("/activities/all");
      validateResponse(res, "activities");
      set({ activities: res.data.activities, error: null });
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
  getActivityById: async (id) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.get(`/activities/${id}`);
      validateResponse(res, "activity");
      return res.data.activity;
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
  updateActivity: async (id, name, description) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.put(`/activities/update/${id}`, {
        name,
        description,
      });
      validateResponse(res, "activity");
      const updatedActivity = res.data.activity;
      set((state) => ({
        activities: state.activities
          ? state.activities.map((activity) =>
              activity.id === id ? updatedActivity : activity
            )
          : [updatedActivity],
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
  deleteActivity: async (id) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await api.delete(`/activities/delete/${id}`);
      validateResponse(res, "message");
      set((state) => ({
        activities: state.activities
          ? state.activities.filter((activity) => activity.id !== id)
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
    socket.off("activityCreated");
    socket.off("activityUpdated");
    socket.off("activityDeleted");

    // Add fresh listeners
    socket.on("activityCreated", (newActivity: Activity) => {
      set((state) => ({
        activities: state.activities
          ? [...state.activities, newActivity]
          : [newActivity],
      }));
    });

    socket.on("activityUpdated", (updatedActivity: Activity) => {
      set((state) => ({
        activities: state.activities
          ? state.activities.map((activity) =>
              activity.id === updatedActivity.id ? updatedActivity : activity
            )
          : [updatedActivity],
      }));
    });

    socket.on("activityDeleted", ({ id }: { id: number }) => {
      set((state) => ({
        activities: state.activities
          ? state.activities.filter((activity) => activity.id !== id)
          : null,
      }));
    });
  },
}));
