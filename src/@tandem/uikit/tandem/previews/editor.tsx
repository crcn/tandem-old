// import "@tandem/uikit/scss/themes/monokai";
import "reflect-metadata";
import React =  require("React");
import ReactDOM = require("react-dom");
import { TreeNode } from "@tandem/common/tree";
import { TreeComponent, GutterComponent } from "@tandem/uikit";
import "./editor.scss";

class ElementNode extends TreeNode<any> {
  constructor(readonly name: string, readonly attributes: any, children: TreeNode<any>[] = []) {
    super();
    children.forEach((child) => this.appendChild(child));
  }
}

class TextNode extends TreeNode<any> {
  constructor(readonly value: string) {
    super();
    this.value = value;
  }
}

// CSS tab
const renderHTMLLayers = () => {
  return null;
}

const renderCSSPane = () => {
  return <div className="css-pane">
  </div>
}

export const createBodyElement = () => {
  const element = document.createElement("div");
  ReactDOM.render(<div className="editor flex row">
    <GutterComponent className="left">
      {renderHTMLLayers()}
      {renderCSSPane()}
      <div className="header">
        CSS
      </div>
    </GutterComponent>

    <div className="center flex column">
      <div className="canvas">
      </div>
      <div className="gutter dark bottom">
        animations
      </div>
    </div>

    <GutterComponent className="right">
      <div className="header">
        Attributes
      </div>
      <hr />
      <div className="header">
        .container
      </div>
      <hr />
    </GutterComponent>
  </div>, element);
  return element;
}