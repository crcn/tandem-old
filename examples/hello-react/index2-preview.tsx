
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HelloComponent } from "./index2";

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<HelloComponent />, element);
  return element;
};
        