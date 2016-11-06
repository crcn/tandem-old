import "./index.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";

const el2 = <div className="test">
  <div className="something">
    Hello
  </div>
</div>;

const element = document.createElement("div");
ReactDOM.render(el2, element);
module.exports = element;
