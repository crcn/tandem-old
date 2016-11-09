import "./test.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

export class TestComponent extends React.Component<{ message: string }, {}> {
  render() {
    return <div className="test">hello {this.props.message}</div>;
  }
}

const element = document.createElement("div");
ReactDOM.render(<TestComponent message="World!!!!!" />, element);

module.exports = element;