import * as React from "react";
import * as ReactDOM from "react-dom";
import { HelloComponent } from "./index";

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<HelloComponent text="Hello World!!" />, element);
  return element;
}