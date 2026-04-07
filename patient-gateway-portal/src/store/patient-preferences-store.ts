"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mockNotificationSettings } from "@/lib/mock/patient-data";
import type { NotificationSettings } from "@/lib/types";

export type ThemeMode = "light" | "dark";

interface PatientPreferencesState {
  theme: ThemeMode;
  settings: NotificationSettings;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSettings: (settings: NotificationSettings) => void;
  patchSettings: (patch: Partial<NotificationSettings>) => void;
}

export const usePatientPreferencesStore = create<PatientPreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      settings: structuredClone(mockNotificationSettings),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setSettings: (settings) => set({ settings }),
      patchSettings: (patch) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...patch,
          },
        })),
    }),
    {
      name: "patient-gateway-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, settings: state.settings }),
    },
  ),
);

