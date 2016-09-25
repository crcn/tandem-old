import * as React from "react";
import { renderMessage } from "./test.tsx";
import "./hello-world.scss";

const render = (message) => {
  return <div class="box" style="color:white;font-size:24px;">Hello {renderMessage(message)}</div>;
}

const element = document.createElement("div");
document.body.appendChild(element);

renderJSX(<span>{render("world")}</span>, element);