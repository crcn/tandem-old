import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { CSSUnitInputComponent } from "./common";
import { BaseApplicationComponent } from "@tandem/common";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { RadioGroupComponent } from "@tandem/uikit";
import * as ReactSliderComponent from "react-slider";
import { CSSMergedRuleLinkComponent, CSSHighlightTargetRuleHintComponent } from "../common";
import * as Select from "react-select";  
import { capitalize, startCase } from "lodash";
import { 
  parseCSSDeclValue, 
  evaluateCSSDeclValue,
  SyntheticCSSFilter,
  SyntheticHTMLElement, 
  SyntheticCSSStyle, 
  SyntheticCSSStyleRule, 
  SyntheticCSSStyleGraphics,
  SyntheticCSSStyleBackground,
  SyntheticCSSStyleBoxShadow,
} from "@tandem/synthetic-browser";

import { MergedCSSStyleRule } from "@tandem/html-extension/editor/browser/models";

// http://www.w3schools.com/csSref/pr_class_display.asp
const DISPLAY_OPTIONS = ["block", "inline", "inline-block", "flex", "non", "table"].map((value) => {
  return { label: value, value: value };
});

// http://www.w3schools.com/css/css_positioning.asp
const POSITION_OPTIONS = ["static", "relative", "fixed", "absolute"].map((value) => {
  return { label: value, value: value };
});

// http://www.w3schools.com/cssref/pr_background-blend-mode.asp
const BLEND_MODE_OPTIONS = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "saturation", "color", "lumocity"].map((value) => {
  return { label: value, value: value };
});

// http://www.w3schools.com/cssref/pr_background-blend-mode.asp
const TEXT_ALIGN_OPTIONS = ["left", "center", "right", "justify"].map((value) => {
  return { label: value, value: value };
});

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
    const { rule, graphics } = this.props;
    return <div className="section" key="appearance">
      <div className="container section">
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="mixBlendMode">
              Opacity
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-7">
            <ReactSliderComponent min={0} max={1} step={0.01} value={graphics.opacity || 1} onChange={(value) => graphics.opacity = value} />
          </div>
          <div className="col-3">
            <input type="text" value={graphics.opacity || 1} onChange={(value) => graphics.opacity = Number(value)} />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="mixBlendMode">
              Blend
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <Select placeholder="--" value={graphics.mixBlendMode} options={BLEND_MODE_OPTIONS} onChange={bindGraphicSelectChange(graphics, "mixBlendMode")} />
          </div>
        </div>
      </div>
    </div>;
  }

  renderLayout() {
    const { rule, graphics } = this.props;
    return <div className="section" key="layout">

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
            <Select placeholder="--" options={DISPLAY_OPTIONS} onChange={bindGraphicSelectChange(graphics, "display")} />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="position">
              Position
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule("left")}>
              <Select placeholder="--" options={POSITION_OPTIONS} onChange={bindGraphicSelectChange(graphics, "position")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="left">
              Left
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule("left")}>
              <input type="text" value={graphics.left && graphics.left.toString()} onChange={bindGraphicInputEvent(graphics, "left")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="top">
              Top
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule("top")}>
              <input type="text" value={graphics.top && graphics.top.toString()} onChange={bindGraphicInputEvent(graphics, "top")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="width">
              Width
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule("width")}>
            <input type="text" value={graphics.width && graphics.width.toString()} onChange={bindGraphicInputEvent(graphics, "width")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="height">
              Height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule("height")}>
            <input type="text" value={graphics.height && graphics.height.toString()} onChange={bindGraphicInputEvent(graphics, "height")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
      </div>
    </div>
  }

  renderTypography() {
    const { rule, graphics } = this.props;
    return <div className="section" key="typography">
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
            <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule("fontFamily")}>
              <input type="text" value={rule.style.fontFamily} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>


        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="fontWeight">
              Weight
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSHighlightTargetRuleHintComponent target={rule.getDeclarationMainSourceRule("fontWeight")}>
              <input type="text" value={rule.style.fontWeight} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="fontSize">
              Size
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <input type="text" value={graphics.fontSize && graphics.fontSize.toString()} onChange={bindGraphicInputEvent(graphics, "fontSize")} />
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="color">
              Size
            </CSSMergedRuleLinkComponent>
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
            <input type="text" value={graphics.letterSpacing && graphics.letterSpacing.toString()} onChange={bindGraphicInputEvent(graphics, "letterSpacing")} />
          </div>
          <div className="col-2 label">       
            <CSSMergedRuleLinkComponent rule={rule} propertyName="lineHeight">
              Line
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <input type="text" value={graphics.lineHeight && graphics.lineHeight.toString()} onChange={bindGraphicInputEvent(graphics, "lineHeight")} />
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="textAlign">
              Align
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <RadioGroupComponent options={TEXT_ALIGN_OPTIONS} value={graphics.textAlign} onChange={bindGraphicSelectChange(graphics, "textAlign")} className="row button-group text-center no-padding" optionClassName="col-3" renderOption={(option) => <i className={"glyphicon glyphicon-align-" + option.value} /> }>
            </RadioGroupComponent>
          </div>
        </div>
      </div>
    </div>
  }

  renderBackgrounds() {
    const { rule, graphics } = this.props;
    const labelClassnames = cx({ row: true, labels: true, hide: graphics.backgrounds.length === 0 });

    return <div className="section" key="backgrounds">
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

        <div className={labelClassnames}>
          <div className="col-2">
            color
          </div>
          <div className="col-4">
            Blend
          </div>
          <div className="col-4">
            Clip
          </div>
        </div>
      
      </div>
    </div>
  }

  renderBoxShadows() {
    const { graphics } = this.props;

    const labelClassnames = cx({ row: true, labels: true, hide: graphics.boxShadows.length === 0 });

    return <div className="section" key="boxShadows">
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
        
        <div className={labelClassnames}>
          <div className="col-2">
            color
          </div>
          <div className="col-2">
            X
          </div>

          <div className="col-2">
            Y
          </div>

          <div className="col-2">
            Blur
          </div>

          <div className="col-2">
            Spread
          </div>

          <div className="col-2">
            Inset
          </div>

        </div>
      </div>
    </div>
  }

  renderFilters() {
    const { graphics } = this.props;
    return <div className="section" key="filters">
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
            return <CSSFilterInputComponent filter={filter} key={filter.name} />
          })
        }
      </div>
    </div>
  }
}

function bindGraphicInputEvent(graphics: SyntheticCSSStyleGraphics|SyntheticCSSStyleBoxShadow|SyntheticCSSStyleBackground, propertyName: string) {
  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    graphics.setProperty(propertyName, event.currentTarget.value);
  }
}

function bindGraphicSelectChange(graphics: SyntheticCSSStyleGraphics|SyntheticCSSStyleBoxShadow|SyntheticCSSStyleBackground, propertyName: string) {
  return ({ value, label }) => {
    graphics.setProperty(propertyName, value);
  }
}

class CSSBackgroundInputComponent extends React.Component<{ background: SyntheticCSSStyleBackground }, any> {
  render() {
    const { background } = this.props;
    const { color, blendMode, clip } = background;
    return <div className="row">
      <div className="col-2">
        <BackgroundFillComponent value={color && color.toString()} />
      </div>
      <div className="col-5">
        <input type="text" value={blendMode} />
      </div>
      <div className="col-5">
        <input type="text" value={clip} />
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
      <div className="col-2">
        <input type="text" value={x.value} onChange={bindGraphicInputEvent(boxShadow, "x")} />
      </div>

      <div className="col-2">
        <input type="text" value={y.value} onChange={bindGraphicInputEvent(boxShadow, "y")} />
      </div>

      <div className="col-2">
        <input type="text" value={blur.value} onChange={bindGraphicInputEvent(boxShadow, "blur")} />
      </div>

      <div className="col-2">
        <input type="text" value={spread.value} onChange={bindGraphicInputEvent(boxShadow, "spread")} />
      </div>

      <div className="col-2">
        <input type="text" value={spread.value} onChange={bindGraphicInputEvent(boxShadow, "spread")} />
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
            {this.renderInput(name, params)}
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

  renderInput(name: string, params: any[]) {
    return <input type="text" value={params[0]} />
  }
}

class BackgroundFillComponent extends React.Component<{ value: string }, any> {
  render() {
    const { value } = this.props;
    return <div className="fill-input" style={{background: value }}>
    </div>
  }
}