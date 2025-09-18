import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// This is the entry point of the React application.
// It finds the 'root' div in index.html and tells React to render
// the <App /> component inside it.
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
