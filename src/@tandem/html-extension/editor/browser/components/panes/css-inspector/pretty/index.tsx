import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { CSSUnitInputComponent } from "./common";
import { BaseApplicationComponent } from "@tandem/common";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { RadioGroupComponent } from "@tandem/uikit";
import { ChromePicker } from "react-color";
import * as ReactSliderComponent from "react-slider";
import { CSSMergedRuleLinkComponent, CSSHighlightTargetRuleHintComponent } from "../common";
import * as Select from "react-select";  
import { capitalize, startCase } from "lodash";
import { 
  parseCSSDeclValue, 
  SyntheticCSSColor,
  SyntheticCSSStyle, 
  SyntheticCSSFilter,
  evaluateCSSDeclValue,
  SyntheticHTMLElement, 
  SyntheticCSSStyleRule, 
  SyntheticCSSStyleGraphics,
  SyntheticCSSStyleBoxShadow,
  SyntheticCSSStyleBackground,
} from "@tandem/synthetic-browser";

import { MergedCSSStyleRule } from "@tandem/html-extension/editor/browser/models";

// http://www.w3schools.com/csSref/pr_class_display.asp
const DISPLAY_OPTIONS = ["block", "inline", "inline-block", "flex", "none", "table"].map((value) => {
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
    const graphics = rule.graphics;
    return <div className="css-pretty-inspector">

      { this.renderLayout() }
      <hr />
      
      <TypographySectionComponent rule={rule} graphics={graphics} />
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="opacity" block={true}>
              <ReactSliderComponent min={0} max={1} step={0.01} value={Number(graphics.opacity || 1)} onChange={bindGraphicsValueChange(graphics, "opacity")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-3">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="opacity" block={true}>
              <BetterTextInput value={graphics.opacity || 1} onChange={bindGraphicsValueChange(graphics, "opacity")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="mixBlendMode">
              Blend
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="mixBlendMode" block={true}>
              <Select placeholder="--" value={graphics.mixBlendMode} clearable={false} options={BLEND_MODE_OPTIONS} onChange={bindGraphicSelectChange(graphics, "mixBlendMode")} />
            </CSSHighlightTargetRuleHintComponent>
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
              <BetterTextInput value="10px" onChange={bindGraphicsValueChange(graphics, "minWidth")} />
            </div>
            <div className="col-2-5 label">
              Min Height
            </div>
            <div className="col-3-5">
              <BetterTextInput value="10px" onChange={bindGraphicsValueChange(graphics, "minHeight")} />
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="display" block={true}> 
              <Select placeholder="--" options={DISPLAY_OPTIONS} clearable={false} value={graphics.display} onChange={bindGraphicSelectChange(graphics, "display")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="position">
              Position
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="position" block={true}> 
              <Select placeholder="--" options={POSITION_OPTIONS} clearable={false} value={graphics.position} onChange={bindGraphicSelectChange(graphics, "position")} />
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="left" block={true}> 
              <BetterTextInput value={graphics.left && graphics.left.toString()} onChange={bindGraphicsValueChange(graphics, "left")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="top">
              Top
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="top" block={true}> 
              <BetterTextInput value={graphics.top && graphics.top.toString()} onChange={bindGraphicsValueChange(graphics, "top")} />
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="width" block={true}> 
              <BetterTextInput value={graphics.width && graphics.width.toString()} onChange={bindGraphicsValueChange(graphics, "width")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="height">
              Height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="height" block={true}> 
              <BetterTextInput value={graphics.height && graphics.height.toString()} onChange={bindGraphicsValueChange(graphics, "height")} />
            </CSSHighlightTargetRuleHintComponent>
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
  return (option) => {
    graphics.setProperty(propertyName, option ? option.value : undefined);
  }
}


function bindGraphicsValueChange(graphics: SyntheticCSSStyleGraphics|SyntheticCSSStyleBoxShadow|SyntheticCSSStyleBackground, propertyName: string) {
  return (value) => {
    graphics[propertyName] = value;
  }
}

abstract class SectionComponent extends React.Component<{ rule: MergedCSSStyleRule, graphics: SyntheticCSSStyleGraphics }, { popup: { title, renderBody } }> {

  state = {
    popup: undefined
  }

  openPopup(title: string, renderBody: any) {
    this.setState({ popup: { title, renderBody }});
  }

  closePopup() {
    this.setState({ popup: undefined });
  }

  render() {
    return <div className="section">
      {this.state.popup ? this.renderPopup() : undefined } 
      {this.renderMainSection()}
    </div>;
  }

  renderPopup() {
    return <div className="popup">
      <div className="container">
        <div className="row title">
          <div className="col-12">
            { this.state.popup.title }
            <div className="pull-right">
              <i className="ion-close" onClick={() => this.closePopup()} />
            </div>
          </div>
        </div>
        {this.state.popup.renderBody && this.state.popup.renderBody() }
      </div>
    </div>
  }

  abstract renderMainSection();
}

class TypographySectionComponent extends SectionComponent {
  renderMainSection() {
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="fontFamily" block={true}>
              <BetterTextInput value={rule.style.fontFamily} onChange={bindGraphicsValueChange(graphics, "fontFamily")} />
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="fontWeight" block={true}>
              <BetterTextInput value={rule.style.fontWeight} onChange={bindGraphicsValueChange(graphics, "fontWeight")} />
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="fontSize" block={true}>
              <BetterTextInput value={graphics.fontSize && graphics.fontSize.toString()} onChange={bindGraphicsValueChange(graphics, "fontSize")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="color">
              Color
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="color" block={true}>
              <BackgroundFillComponent value={rule.style.color || "#000"} onClick={() => 
                this.openPopup("Font Color", this.renderFontColorPicker)
              } />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">      
            <CSSMergedRuleLinkComponent rule={rule} propertyName="letterSpacing">
              Spacing
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="letterSpacing" block={true}>
              <BetterTextInput value={graphics.letterSpacing && graphics.letterSpacing.toString()} onChange={bindGraphicsValueChange(graphics, "letterSpacing")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">       
            <CSSMergedRuleLinkComponent rule={rule} propertyName="lineHeight">
              Line
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="lineHeight" block={true}>
              <BetterTextInput value={graphics.lineHeight && graphics.lineHeight.toString()} onChange={bindGraphicsValueChange(graphics, "lineHeight")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="textAlign">
              Align
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="textAlign" block={true}>
              <RadioGroupComponent options={TEXT_ALIGN_OPTIONS} value={graphics.textAlign} onChange={bindGraphicSelectChange(graphics, "textAlign")} className="row button-group text-center no-padding" optionClassName="col-3" renderOption={(option) => <i className={"glyphicon glyphicon-align-" + option.value} /> }>
              </RadioGroupComponent>
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
      </div>
    </div>
  }

  renderFontColorPicker = () => {
    const { rule, graphics } = this.props;
    return <ChromePicker color={graphics.color.toString()} onChange={(color) => graphics.color = new SyntheticCSSColor(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a)} />
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
        <BetterTextInput value={blendMode} onChange={bindGraphicsValueChange(background, "blendMode")} />
      </div>
      <div className="col-5">
        <BetterTextInput value={clip} onChange={bindGraphicsValueChange(background, "clip")}  />
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
        <BetterTextInput value={x.value} onChange={bindGraphicsValueChange(boxShadow, "x")} />
      </div>

      <div className="col-2">
        <BetterTextInput value={y.value} onChange={bindGraphicsValueChange(boxShadow, "y")} />
      </div>

      <div className="col-2">
        <BetterTextInput value={blur.value} onChange={bindGraphicInputEvent(boxShadow, "blur")} />
      </div>

      <div className="col-2">
        <BetterTextInput value={spread.value} onChange={bindGraphicInputEvent(boxShadow, "spread")} />
      </div>

      <div className="col-2">
        <BetterTextInput value={spread.value} onChange={bindGraphicInputEvent(boxShadow, "spread")} />
      </div>
    </div>
  }
}


export class BetterTextInput extends React.Component<{ onChange(newValue): any, value: any }, { currentValue }> {
  state = {
    currentValue: undefined
  }
  onChange = (event: React.KeyboardEvent<any>) => {
    this.props.onChange(this.state.currentValue = event.currentTarget.value);
  }
  onFocus = (event: React.FocusEvent<any>) => {
    this.setState({ currentValue: event.currentTarget.value });
  }
  onBlur = () => {
    this.setState({ currentValue: undefined });
  }
  render() {
    return <input type="text" {...(this.state.currentValue ? { } : { value: this.props.value })} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} />
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
    return <BetterTextInput value={params[0]} onChange={() => {}} />
  }
}

class BackgroundFillComponent extends React.Component<{ value: string, onClick?: () => any }, any> {
  render() {
    const { value } = this.props;
    return <div className="fill-input" onClick={this.props.onClick} style={{background: value }}>
    </div>
  }
}