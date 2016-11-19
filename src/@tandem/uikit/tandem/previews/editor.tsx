// import "@tandem/uikit/scss/themes/monokai";
import "reflect-metadata";
import * as React from "react";
import * as ReactDOM from "react-dom";
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
const renderLayers = () => {
  const node = new ElementNode("div", { "id": "application"}, [
      new ElementNode("ul", { class: "items" }, [
        new ElementNode("li", {}, [
          new TextNode("cars")
        ])
      ])
    ]
  )

  const renderLabel = (node: ElementNode|TextNode) => {
    return {
      text: ({ value }: TextNode) => <span>{ value }</span>,
      element: ({ attributes, name }: ElementNode) => <span>
        <span className="entity name tag">
          { name }
        </span>
        { attributes.id ? <span className="entity other attribute-name">#{ attributes.id }</span> : null }
        { attributes.class ? <span className="entity other attribute-name">.{ attributes.class }</span> : null }
        </span>
    }[node["value"] ? "text" : "element"](node);
  }

  return <div>
    <div className="header">
      HTML
    </div>
    <TreeComponent nodes={[node]} renderLabel={renderLabel} />
  </div>
}

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<div className="editor flex row">
    <GutterComponent className="left">
      {renderLayers()}
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