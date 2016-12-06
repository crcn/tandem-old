import "@tandem/uikit/scss/index.scss";
import "./inputs.scss";

import React =  require("React");
import ReactDOM = require("react-dom");

export const createBodyElement = () => {
  const element = document.createElement("div");
  ReactDOM.render(<div className="container">
    <ul className="row">
      <li className="button">
        Button
      </li>
      <li className="slider">

      </li>
      <li className="progress">
        Progress
      </li>
    </ul>
  </div>, element);
  return element;
}