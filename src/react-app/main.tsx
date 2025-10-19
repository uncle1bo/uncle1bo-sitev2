import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "normalize.css"
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </StrictMode>,
);
