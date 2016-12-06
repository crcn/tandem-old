
import React =  require("React");
import ReactDOM = require("react-dom");
import { Hello } from "./hello";

export const createBodyElement = () => {
  const element = document.createElement("div");
  ReactDOM.render(<Hello text="rick" />, element);
  return element;
};
