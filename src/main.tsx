import React from "react";
import ReactDOM from "react-dom/client";
// @ts-ignore
import App from "./components/App";
import "./index.css";

const node = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(node).render(
  // TODO add <React.StrictMode>
  <App />
);
