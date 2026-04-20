import { create } from "zustand";

type AppState = {
  activeAssistant: "copilot" | "recipes" | "pantry";
  setActiveAssistant: (assistant: AppState["activeAssistant"]) => void;
};

export const useAppStore = create<AppState>((set) => ({
  activeAssistant: "copilot",
  setActiveAssistant: (assistant) => set({ activeAssistant: assistant })
}));