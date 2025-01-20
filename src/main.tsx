import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import{ GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>

    <GoogleOAuthProvider clientId='349014088899-9tap25m4qidc2s8n8b4t8o82i737k9ac.apps.googleusercontent.com'>
        <App />
    </GoogleOAuthProvider>
     </Provider>
  </StrictMode>
)
