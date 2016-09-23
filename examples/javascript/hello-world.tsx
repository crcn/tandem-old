
import * as React from "react";

class Component extends React.Component {
  render() {
    return <span>{this}</span>;
  }
}

const component = new Component();
console.log("Hello!!f", component.render());