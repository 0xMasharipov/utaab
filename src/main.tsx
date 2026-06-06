import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import UTAABLoader from "./components/UTAABLoader.tsx";
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

function Boot() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <App />
      {loading && <UTAABLoader onComplete={() => setLoading(false)} />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Boot />
    </HelmetProvider>
  </React.StrictMode>
);
