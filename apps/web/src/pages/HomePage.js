import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAppStore } from "../state/app-store";
export function HomePage() {
    const activeAssistant = useAppStore((state) => state.activeAssistant);
    return (_jsxs("main", { children: [_jsx("h1", { children: "Recipe Copilot" }), _jsx("p", { children: "Plan meals, manage pantry items, and run guided cooking sessions." }), _jsxs("p", { children: ["Current assistant mode: ", activeAssistant] })] }));
}
