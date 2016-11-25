import * as React from "react";
import { MergedCSSStyleRule } from "@tandem/synthetic-browser";
import { SyntheticSourceLink } from "@tandem/editor/browser/components/common";
import { CSSUnitInputComponent } from "../common";
import { CSSMergedRuleLinkComponent } from "../../common";
import { BaseApplicationComponent } from "@tandem/common";

export class CSSLayoutComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="section">

      <div className="advanced hide">
        <div className="container">
          <div className="row title">
            <div className="col-12">
              Advanced
              <div className="controls">
                <i className="ion-close" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2-5 label">
              Min Width
            </div>
            <div className="col-3-5">
              <input type="text" value="10px" />
            </div>
            <div className="col-2-5 label">
              Min Height
            </div>
            <div className="col-3-5">
              <input type="text" value="10px" />
            </div>
          </div>
        </div>
      </div>


      <div className="container">
        <div className="row title">
          <div className="col-12">
            Layout
            <div className="controls">
              <i className="ion-more" />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Display
          </div>
          <div className="col-10">
            <CSSUnitInputComponent rule={rule} propertyName="display" />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            Left
          </div>
          <div className="col-4">
            <input type="text" value="" />
          </div>
          <div className="col-2 label">
            Top
          </div>
          <div className="col-4">
            <input type="text" value="" />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="width">
              Width
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSUnitInputComponent rule={rule} propertyName="width" />
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="height">
              Height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSUnitInputComponent rule={rule} propertyName="height" />
          </div>
        </div>
      </div>
    </div>
  }
}