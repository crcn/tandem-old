import "./index.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";

const el2 = <div className="test">
  <div className="something" style={{ color: "black", fontWeight: 100 }}>
    <span>Hello!!!</span>
  </div>
</div>;

console.log("I", "am", "a", "log");

const element = document.createElement("div");
ReactDOM.render(el2, element);
module.exports = element;
