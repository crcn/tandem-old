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
import * as CheckboxComponent from "rc-checkbox";

import { capitalize, startCase } from "lodash";
import { SUPPORTED_FONTS } from "@tandem/html-extension/editor/browser/constants";
import { 
  parseCSSDeclValue, 
  SyntheticCSSColor,
  SyntheticCSSStyle, 
  SyntheticCSSFilter,
  getCSSFontFaceRules,
  SyntheticCSSFontFace,
  evaluateCSSDeclValue,
  SyntheticHTMLElement, 
  SyntheticCSSStyleGraphics,
  SyntheticCSSStyleBoxShadow,
  SyntheticCSSStyleBackground,
  SyntheticCSSElementStyleRule, 
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

const DEFAULT_FONT_FAMILY_OPTIONS = SUPPORTED_FONTS.map((value) => {
  return { label: value, value: value };
});

const BACKGROUND_REPEAT_OPTIONS = ["repeat", "repeat-x", "repeat-y", "no-repeat"].map((value) => {
  return { label: value, value: value };
});

const WORD_WRAP_OPTIONS = ["normal", "break-word", "initial"].map((value) => {
  return { label: value, value: value };
});

const TEXT_OVERFLOW_OPTIONS = ["initial", "ellipsis", "clip"].map((value) => {
  return { label: value, value: value };
});

const LAYOUT_OVERFLOW_OPTIONS = ["visible", "hidden", "scroll"].map((value) => {
  return { label: value, value: value };
});

export class CSSPrettyInspectorComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule, graphics: SyntheticCSSStyleGraphics }, any> {
  render() {
    const { rule } = this.props;
    const graphics = rule.graphics;
    return <div className="css-pretty-inspector">

      <LayoutSectionComponent rule={rule} graphics={graphics} />
      <hr />
      
      <TypographySectionComponent rule={rule} graphics={graphics} />
      <hr />

      { this.renderAppearance() }
      <hr />

      <BackgroundsSectionComponent rule={rule} graphics={graphics} />
      <hr />

      <BoxShadowsSectionComponent rule={rule} graphics={graphics} />
      <hr />

      { this.renderFilters() }
      <hr />

      { this.renderAnimations() }
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
              <Select placeholder="--" value={graphics.mixBlendMode} clearable={true} options={BLEND_MODE_OPTIONS} onChange={bindGraphicSelectChange(graphics, "mixBlendMode")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
      </div>
    </div>;
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

  renderAnimations() {
    const { graphics } = this.props;

    // TODO - more buttons needs to popup an animation timeline footer
    return <div className="section" key="animations">
      <div className="container section">
        <div className="row title">
          <div className="col-12">
            Animations
            <div className="controls">
              <i className="ion-more" />
            </div>
          </div>
          
        </div>

      </div>
    </div>;
  }
}

function bindGraphicInputEvent(graphics: SyntheticCSSStyleGraphics|SyntheticCSSStyleBoxShadow|SyntheticCSSStyleBackground, propertyName: string) {
  return (event: React.KeyboardEvent<HTMLInputElement>) => {
    graphics.setProperty(propertyName, event.currentTarget.value);
  }
}

function bindGraphicSelectChange(graphics: SyntheticCSSStyleGraphics|SyntheticCSSStyleBoxShadow|SyntheticCSSStyleBackground, propertyName: string, map?: (value) => any) {
  if (!map) map = value => value;
  return (option) => {
    graphics.setProperty(propertyName, option ? map(option.value) : undefined);
  }
}


function bindGraphicsValueChange(graphics: SyntheticCSSStyleGraphics|SyntheticCSSStyleBoxShadow|SyntheticCSSStyleBackground, propertyName: string) {
  return (value) => {
    graphics[propertyName] = value;
  }
}

type OpenPopupFunction = (title: string, renderBody: () => any) => any;

interface ISectionComponentProps {
  rule: MergedCSSStyleRule;
  graphics: SyntheticCSSStyleGraphics;
}

interface ISectionComponentPopup {
  title: string;
  renderBody: () => any;
}

abstract class SectionComponent<T extends ISectionComponentProps> extends React.Component<T, any> {

  protected _popup: ISectionComponentPopup;

  openPopup = (title: string, renderBody: () => any) => {
    this._popup = { title, renderBody };
    this.setState({});
  }

  closePopup = () => {
    this._popup = undefined;
    this.onClosePopup();
    this.setState({});
  }

  onClosePopup() {

  }

  render() {
    return <div className="section">
      {this._popup ? this.renderPopup() : undefined } 
      {this.renderMainSection()}
    </div>;
  }

  renderPopup() {
    return <SidebarPopupComponent {...this._popup} closePopup={() => this.closePopup()} />;
  }

  abstract renderMainSection();
}

class SidebarPopupComponent extends React.Component<ISectionComponentPopup & { closePopup(): any }, { stickToBottom: boolean }> {

  state = {
    stickToBottom: false
  }

  componentDidMount() {
    const popup = (this.refs as any).popup;
    const rect = popup.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      this.setState({ stickToBottom: true });
    }
    
    document.body.addEventListener("click", this.onDocumentClick);
  }

  onDocumentClick = (event: MouseEvent) => {
    const popup = (this.refs as any).popup as HTMLElement;
    if (event.target === popup || popup.contains(event.target as HTMLElement)) {
      return;
    }

    this.props.closePopup();
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.onDocumentClick);
  }

  render() {
    return <div className="popup" ref="popup" style={{ bottom: this.state.stickToBottom ? 0 : undefined }}>
      <div className="container">
        <div className="row title">
          <div className="col-12">
            { this.props.title }
            <div className="pull-right">
              <i className="ion-close" onClick={() => this.props.closePopup()} />
            </div>
          </div>
        </div>
        {this.props.renderBody && this.props.renderBody() }
      </div>
    </div>;
  }
}

class LayoutSectionComponent extends SectionComponent<any> {  
  
  componentDidMount() {
    if (process.env.SANDBOXED) {
      this.openPopup("Advanced", this.renderAdvancedSection);
    }
  }

  renderMainSection() {
    const { rule, graphics } = this.props;
    return <div className="section" key="layout">

      <div className="container">
        <div className="row title">
          <div className="col-12">
            Layout
            <div className="controls">
              <i className="ion-more" onClick={() => {
                this.openPopup("Advanced", this.renderAdvancedSection);
              }} />
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
              <Select placeholder="--" options={DISPLAY_OPTIONS} clearable={true} value={graphics.display} onChange={bindGraphicSelectChange(graphics, "display")} />
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
              <Select placeholder="--" options={POSITION_OPTIONS} clearable={true} value={graphics.position} onChange={bindGraphicSelectChange(graphics, "position")} />
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

  renderAdvancedSection = () => {
    const { graphics, rule } = this.props;
    return <div>
      <div className="advanced-layout">
        <div className="row">
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="minWidth">
              Min width
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="minWidth" block={true}> 
              <BetterTextInput value={graphics.minWidth} onChange={bindGraphicsValueChange(graphics, "minWidth")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="minHeight">
              Min height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="minheight" block={true}> 
              <BetterTextInput value={graphics.minHeight} onChange={bindGraphicsValueChange(graphics, "minHeight")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row">
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="maxWidth">
              Max width
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="maxWidth" block={true}> 
              <BetterTextInput value={graphics.maxWidth} onChange={bindGraphicsValueChange(graphics, "maxWidth")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="maxHeight">
              Max height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="maxHeight" block={true}> 
              <BetterTextInput value={graphics.maxHeight} onChange={bindGraphicsValueChange(graphics, "maxHeight")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row">
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="overflow">
              Overflow
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="maxWidth" block={true}> 
              <Select options={LAYOUT_OVERFLOW_OPTIONS} placeholder="--" value={graphics.overflow} onChange={bindGraphicSelectChange(graphics, "overflow")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-6">
          </div>
        </div>
      </div>
    </div>
  }
}



class TypographySectionComponent extends SectionComponent<any> {

  componentDidMount() {
    if (process.env.SANDBOXED) {
      this.openPopup("Advanced", this.renderAdvancedSection);
    }
  }

  renderMainSection() {
    const { rule, graphics } = this.props;
    return <div className="section" key="typography">
      <div className="container">
        <div className="row title">
          <div className="col-12">
            Typography
            <div className="controls">
              <i className="ion-more" onClick={() => {
                this.openPopup("Advanced", this.renderAdvancedSection);
              }} />
            </div>
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
              <Select options={this.getFontFamilyOptions()} placeholder="--" value={graphics.fontFamily.length ? graphics.fontFamily[0] : undefined} onChange={bindGraphicSelectChange(graphics, "fontFamily", font => [`'${font}'`])} />
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

  renderAdvancedSection = () => {
    const { graphics, rule } = this.props;
    return <div>
      <div className="advanced-typography">
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="wordWrap">
              Wrap
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="minWidth" block={true}> 
              <Select options={WORD_WRAP_OPTIONS} placeholder="--" value={graphics.wordWrap} onChange={bindGraphicSelectChange(graphics, "wordWrap")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="wordWrap">
              Overflow
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-10">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="minWidth" block={true}> 
              <Select options={TEXT_OVERFLOW_OPTIONS} placeholder="--" value={graphics.textOverflow} onChange={bindGraphicSelectChange(graphics, "textOverflow")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
      </div>
    </div>
  }

  getFontFamilyOptions = () => {
    return [...getCSSFontFaceRules(this.props.rule.target).map((rule) => {
      const font = String(rule.style.fontFamily).replace(/["']/g, "");
      return  { value: font, label: font };
    }), ...DEFAULT_FONT_FAMILY_OPTIONS];
  }

  renderFontColorPicker = () => {
    const { rule, graphics } = this.props;
    return <div className="container">
      <div className="row">
        <div className="col-12">
          <ChromePicker color={graphics.color.toString()} onChange={(color) => graphics.color = new SyntheticCSSColor(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a)} />
        </div>
      </div>
    </div>
  }
}

class BackgroundsSectionComponent extends SectionComponent<any> {
  
  private _selectedBackgroundIndex: number = -1;

  selectBackground = (background: SyntheticCSSStyleBackground) => {
    this._selectedBackgroundIndex = this.props.graphics.backgrounds.indexOf(background);

    if (background == null) {
      this.closePopup();
    } else {
      this.openPopup("Options", this.renderFill);
    }
  }

  onClosePopup() {
    this._selectedBackgroundIndex = -1;
  }

  renderMainSection() {
    const { rule, graphics } = this.props;
    const selectedBackgroundIndex = this._selectedBackgroundIndex;
    const labelClassnames = cx({ row: true, labels: true, hide: graphics.backgrounds.length === 0 });

    return <div className="section background-section" key="backgrounds">
      <div className="container section">
        <div className="row title">
          <div className="col-12">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="background" block={true}>
              Backgrounds
              <div className="controls">
                <i className="ion-trash-a" style={{ display: selectedBackgroundIndex !== -1 ? undefined : "none" }} onMouseDown={() => {
                  this.selectBackground(undefined);
                  graphics.removeBackground(graphics.backgrounds[selectedBackgroundIndex]);
                }} />

                  <i className="ion-plus-round" onClick={() => {
                    this.selectBackground(graphics.addBackground([new SyntheticCSSColor(0, 0, 0, 1)]));
                  }} />
              </div>
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row bg-list">
          <div className="col-12">
            <ul>
              {
                graphics.backgrounds.map((background, i) => {
                  return <CSSBackgroundInputComponent background={background} rule={rule} key={i} select={this.selectBackground}  />
                })
              }
            </ul>
          </div>
        </div>

      </div>
    </div> 
  }

  renderFill = () => {

    const background = this.props.graphics.backgrounds[this._selectedBackgroundIndex];

    if (!background) return null;

    return <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ChromePicker color={background.color.toString()} onChange={({ rgb }) => {
              background.color = SyntheticCSSColor.fromRGBA(rgb);
            }} />
          </div>
        </div>
      </div>
      <hr />
      <div className="container hide">
        <div className="row title">
          <div className="col-12">
            Image
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            [IMAGE]
          </div>
          <div className="col-6">
            <button>Choose file...</button>
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            Size
          </div>
          <div className="col-4">
            <BetterTextInput value={background.size} onChange={bindGraphicsValueChange(background, "size")} />
          </div>
          <div className="col-2 label">
            Repeat
          </div>
          <div className="col-4">
            <Select options={BACKGROUND_REPEAT_OPTIONS} value={background.repeat} onChange={bindGraphicsValueChange(background, "repeat")} />
          </div>
        </div>
        <div className="row">
          <div className="col-2 label">
            Blend
          </div>
          <div className="col-4">
            <Select placeholder="--" value={background.blendMode} clearable={true} options={BLEND_MODE_OPTIONS} onChange={bindGraphicSelectChange(background, "blendMode")} />
          </div>
        </div>
      </div>
    </div>
  }
}

class BoxShadowsSectionComponent extends SectionComponent<any> {

  private _selectedBoxShadowIndex: number = -1;


  componentDidMount() {
    if (process.env.SANDBOXED) {
      this._selectedBoxShadowIndex = 0;
      this.openPopup("Options", this.renderShadowOptions);
    }
  }

  selectBoxShadow = (boxShadow: SyntheticCSSStyleBoxShadow) => {
    this._selectedBoxShadowIndex = this.props.graphics.boxShadows.indexOf(boxShadow);
    if (this._selectedBoxShadowIndex === -1) {
      this.closePopup();
    } else {
      this.openPopup("Options", this.renderShadowOptions);
    }
  }

  onClosePopup() {
    this._selectedBoxShadowIndex = -1;
  }

  renderMainSection() {
    const { graphics, rule } = this.props;
    const selectedBoxShadowIndex = this._selectedBoxShadowIndex;

    const labelClassnames = cx({ row: true, labels: true, hide: graphics.boxShadows.length === 0 });

    return <div className="section" key="boxShadows">
      <div className="container section">
        <div className="row title">
          <div className="col-12">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="boxShadow" block={true}>
              Box shadows
              <div className="controls">

                <i className="ion-trash-a" style={{ display: selectedBoxShadowIndex !== -1 ? undefined : "none" }} onMouseDown={() => {
                  this.selectBoxShadow(undefined);
                  graphics.removeBoxShadow(graphics.boxShadows[selectedBoxShadowIndex]);
                }} />

                  <i className="ion-plus-round" onClick={() => {
                    this.selectBoxShadow(graphics.addBoxShadow([0, 0, 2, 1, new SyntheticCSSColor(0, 0, 0, 1)]));
                  }} />
              </div>
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row bg-list">
          <div className="col-12">
            <ul>
              {
                graphics.boxShadows.map((background, i) => {
                  return <CSSBoxShadowInputComponent boxShadow={background} key={i} rule={rule} select={this.selectBoxShadow}  />
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </div>;
  }

  renderShadowOptions = () => {
    const boxShadow = this.props.graphics.boxShadows[this._selectedBoxShadowIndex] || new SyntheticCSSStyleBoxShadow([0, 0, 0, 0, new SyntheticCSSColor(0, 0, 0, 1)])
    if (!boxShadow) return null;


    return <div className="container"> 
       <div className="container">
        <div className="row">
          <div className="col-12">
            { !process.env.SANDBOXED ? <ChromePicker color={boxShadow.color.toString()} onChange={({ rgb }) => {
              boxShadow.color = SyntheticCSSColor.fromRGBA(rgb);
            }} /> : null }
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-2 label">
          X
        </div>
        <div className="col-4">
          <BetterTextInput value={boxShadow.x} onChange={bindGraphicsValueChange(boxShadow, "x")} />
        </div>
        <div className="col-2 label">
          Y
        </div>
        <div className="col-4">
          <BetterTextInput value={boxShadow.x} onChange={bindGraphicsValueChange(boxShadow, "y")} />
        </div>
      </div>
      <div className="row">
        <div className="col-2 label">
          Blur
        </div>
        <div className="col-4">
          <BetterTextInput value={boxShadow.blur} onChange={bindGraphicsValueChange(boxShadow, "blur")} />
        </div>
        <div className="col-2 label">
          Spread
        </div>
        <div className="col-4">
          <BetterTextInput value={boxShadow.spread} onChange={bindGraphicsValueChange(boxShadow, "spread")} />
        </div>
      </div>
      <div className="row">
        <div className="col-2 label">
          Inset
        </div>
        <div className="col-4">
          <BetterCheckbox checked={boxShadow.inset} onChange={bindGraphicsValueChange(boxShadow, "inset")} />
        </div>
      </div>
    </div>;
  }
}

class CSSBackgroundInputComponent extends React.Component<{ background: SyntheticCSSStyleBackground, rule: MergedCSSStyleRule, select: (background: SyntheticCSSStyleBackground) => any }, any> {

  componentDidMount() {
    // this.props.openPopup("Fill", this.renderFill);
  }

  render() {
    const { background, select, rule } = this.props;
    const { color, blendMode, clip } = background;
    return <li>
      <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="background" block={true}>
        <BackgroundFillComponent value={color && color.toString()} onClick={() => {
          select(background);
        }} />
      </CSSHighlightTargetRuleHintComponent>
    </li>;
  }
}

class CSSBoxShadowInputComponent extends React.Component<{ boxShadow: SyntheticCSSStyleBoxShadow, rule: MergedCSSStyleRule, select: (shadow: SyntheticCSSStyleBoxShadow) => any }, any> {
  render() {
    const { boxShadow, rule } = this.props;
    const { color, x, y, blur, spread, inset } = boxShadow;
    
    return <li>
      <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="background" block={true}>
        <BackgroundFillComponent value={color && color.toString()} onClick={() => {
          this.props.select(boxShadow);
        }} />
      </CSSHighlightTargetRuleHintComponent>
    </li>
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
    return <input type="text" {...(this.state.currentValue != null ? { } : { value: this.props.value })} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} />
  }
}

export class BetterCheckbox extends React.Component<{ onChange(newValue): any, checked: any }, { currentValue }> {
  state = {
    currentValue: undefined
  }
  onChange = (event: any) => {
    this.props.onChange(!!event.target.checked);
  }
  render() {
    return <CheckboxComponent type="checkbox" name="default" prefixCls="checkbox" checked={Number(!!this.props.checked)} onChange={this.onChange} />
  }
}

// TODO - drag input values
// TODO - drop menu
// TODO - up/down arrow support
export class CSSUnitInput extends BetterTextInput {
  // TODO 
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
    return <BetterTextInput value={params && params[0]} onChange={() => {}} />
  }
}

class BackgroundFillComponent extends React.Component<{ value: string, onClick?: () => any }, any> {
  render() {
    const { value } = this.props;
    return <div className="fill-input" onClick={this.props.onClick} style={{background: value }}>
    </div>
  }
}