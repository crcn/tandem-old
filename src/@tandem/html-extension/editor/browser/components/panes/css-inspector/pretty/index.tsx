import "./index.scss";
import * as React from "react";
import { CSSUnitInputComponent } from "./common";
import { BaseApplicationComponent } from "@tandem/common";
import * as ReactSliderComponent from "react-slider";
import { CSSMergedRuleLinkComponent } from "../common";
import { capitalize, startCase } from "lodash";
import { 
  parseCSSDeclValue, 
  evaluateCSSDeclValue,
  SyntheticCSSFilter,
  MergedCSSStyleRule, 
  SyntheticHTMLElement, 
  SyntheticCSSStyle, 
  SyntheticCSSStyleGraphics,
  SyntheticCSSStyleBackground,
  SyntheticCSSStyleBoxShadow,
} from "@tandem/synthetic-browser";

export class CSSPrettyInspectorComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule, graphics: SyntheticCSSStyleGraphics }, any> {
  render() {
    const { rule } = this.props;
    return <div className="css-pretty-inspector">

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
            <BackgroundFillComponent value={rule.style.color || "#000"} />
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
    const { rule, graphics } = this.props;
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

        {
          graphics.backgrounds.map((background, i) => {
            return <CSSBackgroundInputComponent background={background} key={i} />
          })
        }

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
    const { graphics } = this.props;
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

        {
          graphics.boxShadows.map((boxShadow, i) => {
            return <CSSBoxShadowInputComponent boxShadow={boxShadow} key={i} />
          })
        }
        
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

  renderFilters() {
    const { graphics } = this.props;
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

        {
          graphics.filters.map((filter) => {
            return <CSSFilterInputComponent filter={filter} />
          })
        }
      </div>
    </div>
  }

}

class CSSBackgroundInputComponent extends React.Component<{ background: SyntheticCSSStyleBackground }, any> {
  render() {
    const { background } = this.props;
    const { color, blendMode } = background;
    return <div className="row">
      <div className="col-2">
        <BackgroundFillComponent value={color && color.toString()} />
      </div>
      <div className="col-10">
        <input type="text" value={blendMode} />
      </div>
    </div>;
  }
}

class CSSBoxShadowInputComponent extends React.Component<{ boxShadow: SyntheticCSSStyleBoxShadow }, any> {
  render() {
    const { boxShadow } = this.props;
    const { color, x, y, blur, spread, inset } = boxShadow;
    return <div className="row">
      <div className="col-2">
        <BackgroundFillComponent value={color && color.toString()} />
      </div>
      <div className="col-2-5">
        <input type="text" value={x.value} />
      </div>

      <div className="col-2-5">
        <input type="text" value={y.value} />
      </div>

      <div className="col-2-5">
        <input type="text" value={blur.value} />
      </div>

      <div className="col-2-5">
        <input type="text" value={spread.value} />
      </div>

    </div>
  }
}

class CSSFilterInputComponent extends React.Component<{ filter: SyntheticCSSFilter }, any> {
  render() {
    const { filter } = this.props;
    const { name, params } = filter;
    return <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <input type="text" value="b" />
          </div>
        </div>
        <div className="row labels">
          <div className="col-12 text-left">
            { capitalize(startCase(name).toLowerCase()) }
          </div>
        </div>
      </div>
    </div>
  }
}

class BackgroundFillComponent extends React.Component<{ value: string }, any> {
  render() {
    const { value } = this.props;
    return <div className="fill-input" style={{background: value }}>
    </div>
  }
}
