import React from "react";
import ReactDOM from "react-dom/client"
import App from "./components/App.jsx";
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./components/App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter> 
    </AuthProvider>

)