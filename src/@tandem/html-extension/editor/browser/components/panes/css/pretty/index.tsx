import * as React from "react";
import { SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser";

export class CSSPrettyPaneComponent extends React.Component<{ style: SyntheticCSSStyleDeclaration }, any> {
  render() {
    return <div>
      <div className="td-section-subheader">Transform</div>
      <div className="container">
        <div className="row">
          <div className="col-xs-2">X</div>
          <div className="col-xs-2">Y</div>
        </div>
        <div className="row">
          <div className="col-xs-2">W</div>
          <div className="col-xs-2">H</div>
        </div>
      </div>
      <div className="td-section-subheader">Typography</div>
      <div className="container">

      </div>
      <div className="td-section-subheader">Background</div>
      <div className="container">
      </div>
      <div className="td-section-subheader">Effects</div>
      <div className="container">
      </div>
    </div>
  }
}