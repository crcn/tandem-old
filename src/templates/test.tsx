// import "./test.scss";

const deps = new Dependencies();

import * as React from "react";
import * as ReactDOM from "react-dom";

export class TestComponent extends React.Component<{ message: string }, {}> {
  render() {
    return <div className="m-item">hello {this.props.message}</div>;
  }
}


const element = document.createElement("div");
ReactDOM.render(<TestComponent message="Worlad" />, element);

module.exports = element;