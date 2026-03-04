import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

// Copy protection
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("copy", (e) => e.preventDefault());
document.addEventListener("selectstart", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (["c", "u", "s", "a"].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
