import "./index.scss";
import * as React from "react";
import { CSSTypographyComponent } from "./typography";
import { CSSLayoutComponent } from "./layout";
import { CSSFiltersComponent } from "./filters";
import { CSSAppearanceComponent } from "./appearance";
import { CSSBackgroundsComponent } from "./backgrounds";
import { CSSBoxShadowsComponent } from "./box-shadows";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticHTMLElement, MergedCSSStyleRule } from "@tandem/synthetic-browser";

export class CSSPrettyInspectorComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="pretty">

      <CSSLayoutComponent rule={rule} />
      <hr />
      
      <CSSTypographyComponent rule={rule} />
      <hr />

      <CSSAppearanceComponent rule={rule} />
      <hr />

      <CSSBackgroundsComponent rule={rule} />
      <hr />

      <CSSBoxShadowsComponent rule={rule} />
      <hr />

      <CSSFiltersComponent rule={rule} />
      <hr />
    </div>
  }
}


export class FillInputComponent extends React.Component<any, any> {
  render() {
    return <div className="fill-input">
    </div>
  }
}