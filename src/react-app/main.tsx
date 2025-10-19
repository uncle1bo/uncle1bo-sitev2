import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "normalize.css"
import 'antd/dist/reset.css'
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";
import Template from "./components/Template";
import ThemeWrapper from "./components/ThemeWrapper";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeWrapper>
      <BrowserRouter>
        <Template>
          <Router />
        </Template>
      </BrowserRouter>
    </ThemeWrapper>
  </StrictMode>,
);
