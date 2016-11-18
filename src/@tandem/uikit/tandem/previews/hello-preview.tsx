
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Hello } from "./hello";

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<Hello text="rick" />, element);
  return element;
};
