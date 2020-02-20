import * as React from "react";
import * as ReactDOM from "react-dom";
import Main, { Item, styled } from "./index.pc";

const Li = styled("li", { className: "secondary" });
const Li2 = styled(Li);
console.log(Main, Item);

React.createElement("form", {});
class App extends React.Component {
  render() {
    return (
      <Main>
        <Item>something</Item>
        <Li>something</Li>
        <Li2>something</Li2>
      </Main>
    );
  }
}

const element = document.createElement("div");
document.body.appendChild(element);

ReactDOM.render(<App />, element);
