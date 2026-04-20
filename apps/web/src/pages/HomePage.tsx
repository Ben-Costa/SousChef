import { useAppStore } from "../state/app-store";

export function HomePage() {
  const activeAssistant = useAppStore((state) => state.activeAssistant);

  return (
    <main>
      <h1>Recipe Copilot</h1>
      <p>Plan meals, manage pantry items, and run guided cooking sessions.</p>
      <p>Current assistant mode: {activeAssistant}</p>
    </main>
  );
}