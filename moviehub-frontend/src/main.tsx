// SUBEDI RABIN M25W0465
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthProvide";


// 1. Force-inject Node.js globals before ANY imports load
(window as unknown as Record<string, unknown>)['global'] = window;
(window as unknown as Record<string, unknown>)['process'] = {
  env: { NODE_ENV: 'development' },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
