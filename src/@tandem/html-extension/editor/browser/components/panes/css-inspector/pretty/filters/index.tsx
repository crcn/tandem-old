import * as React from "react";
import { MergedCSSStyleRule } from "@tandem/synthetic-browser";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";

export class CSSFiltersComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="section">
      <div className="container section">
        <div className="row title">
          <div className="col-12">
            Filters
            <div className="controls">
              <i className="ion-plus-round" />
            </div>
          </div>
          
        </div>

        Filter this
      </div>
    </div>
  }
}