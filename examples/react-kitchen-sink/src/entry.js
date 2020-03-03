import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
var mount = document.createElement("div");
document.body.appendChild(mount);
ReactDOM.render(React.createElement(App, null), mount);
