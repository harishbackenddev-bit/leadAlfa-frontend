import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClientProvider } from "@tanstack/react-query";
import "../public/index.css";
import "./utils/theme";
import "swiper/css";
import "swiper/css/navigation";


import App from "./App.jsx";
import store from "./store";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";
import { queryClient } from "./services/tanstack/queryClient";

// Must match backend AUTH0_DOMAIN (custom domain) and AUTH0_AUDIENCE
// (tenant Management API). Never build audience from the custom domain —
// Auth0 only recognizes https://{tenant}.auth0.com/api/v2/.
const auth0Domain = import.meta.env.VITE_DOMAIN;
const auth0Audience =
  import.meta.env.VITE_AUTH0_AUDIENCE ||
  (import.meta.env.VITE_AUTH0_TENANT_DOMAIN
    ? `https://${import.meta.env.VITE_AUTH0_TENANT_DOMAIN}/api/v2/`
    : undefined);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={auth0Domain}
        clientId={import.meta.env.VITE_CLIENT_ID}
        cacheLocation="localstorage"
        useRefreshTokens={true}
        authorizationParams={{
          redirect_uri: `${window.location.origin}/auth/callback`,
          audience: auth0Audience,
          scope: "openid profile email",
        }}
      >
 

        <NotificationProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </NotificationProvider>
      </Auth0Provider>
    </QueryClientProvider>
  </Provider>,
);
