import * as React from "react";
import * as ReactDOM from "react-dom";
import { RootComponent } from "./components/root";

export type TandemWebConfig = {
  element: HTMLElement
};

export const init = ({ element }: TandemWebConfig) => {
  ReactDOM.render(React.createElement(RootComponent), element);
};