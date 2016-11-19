import * as React from "react";
import * as ReactDOM from "react-dom";
import { TreeComponent, GutterComponent } from "@tandem/uikit";
import { TreeNode } from "@tandem/common/tree";
import "./editor.scss";

class TestNode extends TreeNode<TestNode> {
  constructor(readonly name: string, readonly attributes: any, children: TestNode[] = []) {
    super();
    children.forEach((child) => this.appendChild(child));
  }
}

const renderLayers = () => {
  const node = new TestNode("div", { "id": "application"}, [
      new TestNode("ul", { class: "items" }, [
        new TestNode("li", [

        ])
      ])
    ]
  )

  const renderLabel = ({ name, attributes }: TestNode) => {
    return <span>
     <span className="tag name">
      { name }
    </span>
    { attributes.id ? <span className="attribute">#{ attributes.id }</span> : null }
    { attributes.class ? <span className="attribute">.{ attributes.class }</span> : null }
    </span>
  }

  return <div>
    <div className="header">
      Layers
    </div>
    <TreeComponent nodes={[node]} renderLabel={renderLabel} />
  </div>
}

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<div className="editor flex row">
    <GutterComponent className="left">
      {renderLayers()}
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