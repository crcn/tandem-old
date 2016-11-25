import * as React from "react";
import { MergedCSSStyleRule } from "@tandem/synthetic-browser";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";

export class CSSBackgroundsComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="section">
      <div className="container section">
        <div className="row title">
          <div className="col-12">
            Backgrounds
            <div className="controls">
              <i className="ion-plus-round" />
            </div>
          </div>
          
        </div>

        <div className="row">
          <div className="col-2">
          </div>
          <div className="col-10">
            <input type="text" value="multiply" />
          </div>
        </div>
        <div className="row labels">
          <div className="col-2">
            color
          </div>
          <div className="col-4">
            Blend mode
          </div>
        </div>
      
      </div>
    </div>
  }
}