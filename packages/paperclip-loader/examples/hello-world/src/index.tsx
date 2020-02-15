import * as React from "react";
import * as ReactDOM from "react-dom";
const { default: Main, Item } = require("./index.pc");

class App extends React.Component {
  render() {
    return (
      <Main>
        <Item>something</Item>
        <Item>something</Item>
        <Item>something</Item>
      </Main>
    );
  }
}

const element = document.createElement("div");
document.body.appendChild(element);

ReactDOM.render(<App />, element);
