import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const FullApp = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const container = document.getElementById("app");

if (import.meta.hot || !container?.innerText) {
  createRoot(container!).render(<FullApp />);
} else {
  hydrateRoot(container!, <FullApp />);
}
