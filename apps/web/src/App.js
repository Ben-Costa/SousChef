import { jsx as _jsx } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
export function App() {
    return (_jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(HomePage, {}) }) }));
}
