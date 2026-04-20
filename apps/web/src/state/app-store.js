import { create } from "zustand";
export const useAppStore = create((set) => ({
    activeAssistant: "copilot",
    setActiveAssistant: (assistant) => set({ activeAssistant: assistant })
}));
