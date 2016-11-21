import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";

export class ElementCSSInspectorComponent extends BaseApplicationComponent<any, any> {
  render() {
    return <div className="css-inspector">
      <div className="header">
        Style
        <div className="controls show">
          <i className="ion-code" />
        </div>
      </div>
      <div className="container">
        contain this :D
      </div>
    </div>
  }
}