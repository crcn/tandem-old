import "./index.scss";
import * as React from "react";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticHTMLElement, MergedCSSStyleRule } from "@tandem/synthetic-browser";
import { CSSUnitInputComponent } from "./common";
import { CSSMergedRuleLinkComponent } from "../common";
import * as ReactSliderComponent from "react-slider";

export class CSSPrettyInspectorComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule }, any> {
  render() {
    const { rule } = this.props;
    return <div className="pretty">

      { this.renderLayout() }
      <hr />
      
      { this.renderTypography() }
      <hr />

      { this.renderAppearance() }
      <hr />

      { this.renderBackgrounds() }
      <hr />

      { this.renderBoxShadows() }
      <hr />

      { this.renderFilters() }
      <hr />
    </div>
  }

  renderFilters() {
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

  renderAppearance() {
    const { rule } = this.props;
    return <div className="section">
      <div className="container section">
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="mixBlendMode">
              Opacity
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-7">
            <ReactSliderComponent min={0} max={1} step={0.01} value={Number(rule.style.opacity)} />
          </div>
          <div className="col-3">
            <input type="text" value={rule.style.opacity} />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="mixBlendMode">
              Blend
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <input type="text" value={rule.style.mixBlendMode} />
          </div>
        </div>
      </div>
    </div>;
  }

  renderLayout() {
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
            <CSSMergedRuleLinkComponent rule={rule} propertyName="display">
              Display
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSUnitInputComponent rule={rule} propertyName="display" />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="position">
              Position
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSUnitInputComponent rule={rule} propertyName="position" />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="left">
              Left
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <input type="text" value={rule.style.left} />
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="top">
              Top
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <input type="text" value={rule.style.top} />
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

  renderTypography() {
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

  renderBackgrounds() {
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

  renderBoxShadows() {
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

class StyleDeclInput extends React.Component<{ rule: MergedCSSStyleRule, name: string, label?: string, colSize?: number }, any> {
  render() {
    let { rule, name, label, colSize } = this.props;
    if (!colSize) colSize = 6;
    
    return <div className="row">
      <div className="col-2 label">
        <CSSMergedRuleLinkComponent rule={rule} propertyName={name}>
          { label || name }
        </CSSMergedRuleLinkComponent>
      </div>
      <div className={"col-" + colSize}>
        <input type="text" value={rule.style[name]} />
      </div>
    </div>
  }
}

export class FillInputComponent extends React.Component<any, any> {
  render() {
    return <div className="fill-input">
    </div>
  }
}