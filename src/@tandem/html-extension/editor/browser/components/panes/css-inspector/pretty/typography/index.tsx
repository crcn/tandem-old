import * as React from "react";
import { MergedCSSStyleRule } from "@tandem/synthetic-browser";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import { CSSMergedRuleLinkComponent } from "../../common";

export class CSSTypographyComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="section">
      <div className="container">
        <div className="row title">
          Typography
          <div className="controls">
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="fontFamily">
              Font
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <input type="text" value={rule.style.fontFamily} />
          </div>
        </div>


        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="fontWeight">
              Weight
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <input type="text" value={rule.style.fontWeight} />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="fontSize">
              Size
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <input type="text" value={rule.style.fontSize} />
          </div>
          <div className="col-2 label">
            Color
          </div>
          <div className="col-4">
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">      
            <CSSMergedRuleLinkComponent rule={rule} propertyName="letterSpacing">
              Spacing
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <input type="text" value={rule.style.letterSpacing} />
          </div>
          <div className="col-2 label">       
            <CSSMergedRuleLinkComponent rule={rule} propertyName="lineHeight">
              Line
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <input type="text" value={rule.style.lineHeight} />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Align
          </div>
          <div className="col-10">
            <div className="row button-group text-center no-padding">
              <div className="col-3">
                <i className="glyphicon glyphicon-align-left" />
              </div>
              <div className="col-3 selected">
                <i className="glyphicon glyphicon-align-center" />
              </div>
              <div className="col-3">
                <i className="glyphicon glyphicon-align-right" />
              </div>
              <div className="col-3">
                <i className="glyphicon glyphicon-align-justify" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}