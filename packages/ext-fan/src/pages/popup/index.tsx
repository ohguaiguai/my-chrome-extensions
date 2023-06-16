import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@assets/styles/tailwind.css";
import { Popup } from "./Popup";

function init() {
  const rootContainer = document.getElementById("app");
  if (!rootContainer) throw new Error("Can't find Popup root element");
  const root = createRoot(rootContainer);
  root.render(<Popup />);
}

init();
