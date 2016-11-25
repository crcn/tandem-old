import * as React from "react";
import { MergedCSSStyleRule } from "@tandem/synthetic-browser";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import * as ReactSliderComponent from "react-slider";

export class CSSAppearanceComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="section">
      <div className="container section">
        <div className="row">
          <div className="col-2 label">
            Opacity
          </div>
          <div className="col-7">
            <ReactSliderComponent min={0} max={100} defaultValue={10} value={10} />
          </div>
          <div className="col-3">
            <input type="text" value="10px" />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            Blend
          </div>
          <div className="col-10">
            <input type="text" value="--" />
          </div>
        </div>
      </div>
    </div>
  }
}