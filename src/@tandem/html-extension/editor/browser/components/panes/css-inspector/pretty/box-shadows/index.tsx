import * as React from "react";
import { MergedCSSStyleRule } from "@tandem/synthetic-browser";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";

export class CSSBoxShadowsComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="section">
      <div className="container section">
        <div className="row title">
          <div className="col-12">
            Box shadows
            <div className="controls">
              <i className="ion-plus-round" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
          </div>
          <div className="col-2-5">
            <input type="text" value="0" />
          </div>

          <div className="col-2-5">
            <input type="text" value="3" />
          </div>

          <div className="col-2-5">
            <input type="text" value="5" />
          </div>

          <div className="col-2-5">
            <input type="text" value="2" />
          </div>

        </div>
        <div className="row labels">
          <div className="col-2">
            color
          </div>
          <div className="col-2-5">
            X
          </div>

          <div className="col-2-5">
            Y
          </div>

          <div className="col-2-5">
            Blur
          </div>

          <div className="col-2-5">
            Spread
          </div>

        </div>
      </div>
    </div>
  }
}