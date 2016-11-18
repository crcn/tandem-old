
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Button } from "./button";

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<Button items={[1, 2, 3, 4, 5]} />, element);
  return element;
};
