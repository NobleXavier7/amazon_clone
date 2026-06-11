import React from "react";
import ReactDOM from "react-dom/client"; //  CHANGED: Added '/client' for modern React mounting
import "./index.css";
import App from "./App";
import reducer, { initialState } from "./reducer";
import { StateProvider } from "./StateProvider";

//  CHANGED: Replaced ReactDOM.render with the modern createRoot method
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>
);

// Completely removed the commented out serviceWorker lines to keep your file perfectly clean!