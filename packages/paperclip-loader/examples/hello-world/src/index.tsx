import * as React from "react";
import * as ReactDOM from "react-dom";
const { default: Main, Item, styled } = require("./index.pc");

const Li = styled("li", { className: "secondary" });
const Li2 = styled("li");

class App extends React.Component {
  render() {
    return (
      <Main>
        <Li>something</Li>
        <Li2>something</Li2>
        <Li2>something</Li2>
      </Main>
    );
  }
}

const element = document.createElement("div");
document.body.appendChild(element);

ReactDOM.render(<App />, element);
