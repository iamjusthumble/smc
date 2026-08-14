import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import config from "./config";
import { setAuth, currentTokenVar } from "./apollo/cache/auth";
import { FAKE_ADMIN_USER, FAKE_TOKEN } from "./mocks/fixtures";
import { AuthProvider } from "./context/auth-context";

// Real Supabase auth (src/context/auth-context.tsx) now gates the app.
// Buses/Drivers/Bookings/Trips/Dashboard/Settings still render mock data,
// though, and read this fake admin off `currentUserVar` directly (company,
// permissions, etc.) — so it still needs seeding on every load, unconditionally,
// purely to keep those pages fed. It no longer has any bearing on access control.
if (config.mockBackend && !currentTokenVar()) {
  setAuth({ user: FAKE_ADMIN_USER, token: FAKE_TOKEN });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
