import "./test.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

export class TestComponent extends React.Component<{}, {}> {
  render() {
    return <div>Helloa!</div>;
  }
}


const element = document.createElement("div");
ReactDOM.render(<TestComponent />, element);

module.exports = element;