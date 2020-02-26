import React from "react";
import ReactDOM from "react-dom";
import App from "./app.pc";

const mount = document.createElement("div");
ReactDOM.render(<App />, mount);
document.body.appendChild(mount);
