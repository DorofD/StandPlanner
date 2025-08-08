import React from "react";
import ReactDOM from "react-dom/client"
import App from "./components/App.jsx";
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext.js";
import { NotificationProvider } from "./contexts/NotificationContext.js";
import { ColorSchemeProvider } from "./contexts/ColorSchemeContext.js";
import 'core-js/stable';
import 'regenerator-runtime/runtime';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ColorSchemeProvider>
        <AuthProvider>
            <NotificationProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    </ColorSchemeProvider>
)