import "@tandem/uikit/scss";
import "./editor.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

export const renderPreview = () => {
  const element = document.createElement("div");
  ReactDOM.render(<div className="editor flex row">
    <div className="gutter left">
      <div className="header">
        Layers
      </div>
      <hr />
      <div className="header">
        Styles
      </div>
      <hr />
      <div className="header">
        Color Pallette
      </div>
      <hr />
    </div>

    <div className="center flex column">
      <div className="canvas">
      </div>
      <div className="gutter dark bottom">
        animations
      </div>
    </div>

    <div className="gutter right">
      <div className="header">
        Attributes
      </div>
      <hr />
      <div className="header">
        CSS
      </div>
      <hr />
      <div className="header">
        .container
      </div>
      <hr />
    </div>
  </div>, element);
  return element;
}