import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { CSSUnitInputComponent } from "./common";
import { BaseApplicationComponent } from "@tandem/common";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { RadioGroupComponent, TextInputComponent } from "@tandem/uikit";
import { ChromePicker } from "react-color";
import * as AutoSizeInput from "react-input-autosize";
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
  SyntheticAmountFilter,
  SyntheticDropShadowFilter,
  getCSSFontFaceRules,
  SyntheticCSSFontFace,
  evaluateCSSDeclValue,
  SyntheticHTMLElement, 
  SyntheticCSSStyleGraphics,
  SyntheticCSSStyleBoxShadow,
  SyntheticCSSStyleBackground,
  SyntheticCSSElementStyleRule, 
} from "@tandem/synthetic-browser";

import { MergedCSSStyleRule } from "@tandem/html-extension/editor/browser/stores";

// http://www.w3schools.com/csSref/pr_class_display.asp
const DISPLAY_OPTIONS = ["block", "inline", "inline-block", "flex", "none", "table"].map((value) => {
  return { label: value, value: value };
});

// https://css-tricks.com/snippets/css/a-guide-to-flexbox/
const FLEX_DIRECTION_OPTIONS = ["row", "column"].map((value) => {
  return { label: value, value: value };
});

const FLEX_WRAP_OPTIONS = ["nowrap", "wrap", "wrap-reverse"].map((value) => {
  return { label: value, value: value };
});
const FLEX_FLOW_OPTIONS = ["start", "end", "center", "space-bwtween", "space-around"].map((value) => {
  return { label: value, value: value };
});

const FLEX_JUSTIFY_CONTENT_OPTIONS = ["flex-start", "flex-end", "center", "space-between", "space-around"].map((value) => {
  return { label: value, value: value };
});

const FLEX_ALIGN_ITEMS_OPTIONS = ["flex-start", "flex-end", "center", "baseline"].map((value) => {
  return { label: value, value: value };
});

const FLEX_ALIGN_CONTENT_OPTIONS = ["flex-start", "flex-end", "center", "space-between", "space-around", "stretch"].map((value) => {
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

// http://www.w3schools.com/cssref/pr_background-blend-mode.asp
const TEXT_DECOR_OPTIONS = ["none", "underline", "overline", "line-through"].map((value) => {
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

const WHITE_SPACE_OPTIONS = ["normal", "nowrap", "pre", "pre-line", "pre-wrap"].map((value) => {
  return { label: value, value: value };
});

const LAYOUT_OVERFLOW_OPTIONS = ["visible", "hidden", "scroll"].map((value) => {
  return { label: value, value: value };
});

const FLOAT_OPTIONS = ["none", "left", "right", "inline-start", "inline-end"].map((value) => {
  return { label: value, value: value };
});

const FONT_STYLE_OPTIONS = ["normal", "italic", "oblique", "initial"].map((value) => {
  return { label: value, value: value };
});

const CSS_FILTER_OPTIONS = ["blur", "brightness", "contrast", "drop-shadow", "grayscale", "hue-rotate", "invert", "opacity", "saturate", "sepia"].map((value) => {
  return { label: value, value: value };
});

const TEXT_TRANSFORM_OPTIONS = ["none", "uppercase", "lowercase", "capitalize"].map((value) => {
  return { label: value, value: value };
});

const DISPLAY_PREVIEWS = {
  block: () => {
    return <div>
      Lorem
      <div className="box" style={{display: "block" }} />
      ipsum
      <div className="box" style={{display: "block" }} />
      dolar
      <div className="box" style={{display: "block" }} />
      sit
    </div>
  },
  inline: () => {
    return <div>
      Lorem <span className="box" style={{display: "inline"}}>ipsum</span> dolor sit amet, <span className="box" style={{display: "inline"}}>consectetur</span> adipiscing elit. In velit.
    </div>
  },
  "inline-block": () => {
    return <div>
      Lorem
      <div className="box" style={{display: "inline-block" }} />
      ipsum
      <div className="box" style={{display: "inline-block" }} />
      dolar
      <div className="box" style={{display: "inline-block" }} />
      sit
    </div>
  },
  "flex": () => {
    return <div>
      <div className="box" style={{ display: "flex", position: "relative" }}>
        <div className="box" style={{ width: "100%" }} />
        <div className="box" style={{ width: "30%" }} />
        <div className="box" style={{ width: "10%" }} />
      </div>
    </div>
  }
}

const FLEX_ALIGN_ITEMS_PREVIEWS = {

}

const FLEX_ALIGN_CONTENT_PREVIEWS = {

}

const FLEX_DIRECTION_PREVIEWS = {
  row: () => {
    return <div>
      <div className="box" style={{ display: "flex", position: "relative", flexDirection: "row" }}>
        <div className="box" style={{ height: "100%" }} />
        <div className="box" style={{ height: "30%" }} />
        <div className="box" style={{ height: "10%" }} />
      </div>
    </div>
  },
  column: () => {
    return <div>
      <div className="box" style={{ display: "flex", position: "relative", flexDirection: "column" }}>
        <div className="box" style={{ width: "100%" }} />
        <div className="box" style={{ width: "30%" }} />
        <div className="box" style={{ width: "10%" }} />
      </div>
    </div>
  }
}

const FLEX_WRAP_PREVIEWS = {

}

const createPreviewMenuOption = (previewRenderers: any) => {
  return (option) => {
    return <StylePropertyPreviewComponent renderer={previewRenderers[option.value]}>{ option.label }</StylePropertyPreviewComponent>
  }
}

export class CSSPrettyInspectorComponent extends BaseApplicationComponent<{ rule: MergedCSSStyleRule, graphics: SyntheticCSSStyleGraphics }, any> {
  render() {
    const { rule } = this.props;
    const graphics = rule.graphics;

      // <CSSBoxSectionComponent rule={rule} graphics={graphics} />
      // <hr />
    return <div className="css-pretty-inspector">

      <LayoutSectionComponent rule={rule} graphics={graphics} />

      <FlexContainerSectionComponent rule={rule} graphics={graphics} />
      <FlexContainerChildSectionComponent rule={rule} graphics={graphics} />
      
      <TypographySectionComponent rule={rule} graphics={graphics} />

      { this.renderAppearance() }
      <hr />

      <BackgroundsSectionComponent rule={rule} graphics={graphics} />

      <BoxShadowsSectionComponent rule={rule} graphics={graphics} />

      <FilterSectionComponent rule={rule} graphics={graphics} />

      { this.renderAnimations() }
    </div>
  }

  renderAppearance() {
    const { rule, graphics } = this.props;
    return <div className="container section" key="appearance">
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
              <TextInputComponent value={graphics.opacity || 1} onChange={bindGraphicsValueChange(graphics, "opacity")} />
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

  renderAnimations() {
    const { graphics } = this.props;

    // TODO - more buttons needs to popup an animation timeline footer
    return <div className="container section" key="animations">
      <div className="section">
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

function bindMergedRuleSelectChange(rule: MergedCSSStyleRule, propertyName?: string) {
  return (option) => {
    rule.setSelectedStyleProperty(propertyName, option.value);
  }
}

function bindMergedRuleValueChange(rule: MergedCSSStyleRule, propertyName?: string) {
  return (value) => {
    rule.setSelectedStyleProperty(propertyName, value);
  }
}


function bindGraphicsValueChange(graphics: SyntheticCSSStyleGraphics|SyntheticCSSStyleBoxShadow|SyntheticCSSStyleBackground|SyntheticCSSFilter, propertyName: string) {
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
    const mainSection = this.renderMainSection();
    if (!mainSection) return null;
    return <div>
      <div className="section">
        {this._popup ? this.renderPopup() : undefined } 
        {mainSection}
      </div>
      <hr />
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


class FilterSectionComponent extends SectionComponent<ISectionComponentProps> {  

  private _selectedFilterIndex: number = -1;

  selectFilter = (filter: SyntheticCSSFilter) => {
    this._selectedFilterIndex = this.props.graphics.filters.indexOf(filter);
    if (filter) {
      this.openPopup(startCase(filter.name), this.renderFilterOptions);
    } else {
      this.closePopup();
    }
  }

  onClosePopup() {
    this._selectedFilterIndex = -1;
  }

  componentDidMount() {
    // if (process.env.SANDBOXED) {
    //   this.selectFilter(this.props.graphics.filters[2]);
    // }
  }
  
  renderMainSection() {
    const { graphics, rule } = this.props;
    const selectedFilterIndex = this._selectedFilterIndex;

    return <div className="container filters-section">
      <div className="row title">        
        <div className="col-12">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="filters" block={true}>
            Filters
            <div className="controls">

              <i className="ion-trash-a" style={{ display: selectedFilterIndex !== -1 ? undefined : "none" }} onMouseDown={() => {
                this.selectFilter(undefined);
                graphics.removeFilter(graphics.filters[selectedFilterIndex]);
              }} />

              <i className="ion-plus-round" onClick={() => {
                graphics.addFilter("drop-shadow", [0, 0, 3, "#000"]);
              }} />
            </div>
          </CSSHighlightTargetRuleHintComponent>
        </div>
      </div>
      {
        graphics.filters.map((filter, i) => {
          return <CSSFilterInputComponent filter={filter} key={i} select={this.selectFilter} rename={(filter, newName) => {
            graphics.renameFilter(filter, newName);
          }} />;
        })
      }
    </div>
  }

  renderFilterOptions = () => {

    const filter = this.props.graphics.filters[this._selectedFilterIndex];
    if (!filter) return null;

    const renderPercentFilter = (filter: SyntheticAmountFilter, max: number = 100) => {
      const setNewAmount = (newValue) => {
        filter.setProperty("amount", newValue + "%");
      } 
      return <div className="row">
        <div className="col-2 label">
          Amount
        </div>
        <div className="col-7">
          <ReactSliderComponent min={0} max={max} step={1} value={filter.amount.value} onChange={setNewAmount} />
        </div>
        <div className="col-3">
          <TextInputComponent value={filter.amount.value} onChange={setNewAmount} />
        </div>
      </div>
    }

    const renderLengthFilter = (filter: SyntheticAmountFilter) => {

      const setNewAmount = (newValue) => {
        filter.setProperty("amount", newValue + "px");
      } 

      return <div className="row">
        <div className="col-2 label">
          Amount
        </div>
        <div className="col-3">
          <TextInputComponent value={filter.amount.value} onChange={setNewAmount} />
        </div>
      </div>
    }

    const renderDropShadowFilter = (filter: SyntheticDropShadowFilter) => {
      return <CSSShadowInputComponent target={filter} />
    }

    const renderAngleFilter = (filter: SyntheticAmountFilter) => {

      const setNewAmount = (newValue) => {
        filter.setProperty("amount", newValue + "deg");
      } 

      return <div className="row">
        <div className="col-2 label">
          Degree
        </div>
        <div className="col-3">
          <TextInputComponent value={filter.amount.value} onChange={setNewAmount} />
        </div>
      </div>
    }

    // https://developer.mozilla.org/en-US/docs/Web/CSS/filter
    const renderer = {
      "blur": renderLengthFilter,
      "brightness": filter => renderPercentFilter(filter, 1000),
      "contrast": filter => renderPercentFilter(filter, 1000),
      "drop-shadow": renderDropShadowFilter,
      "grayscale": renderPercentFilter,
      "hue-rotate": renderAngleFilter,
      "invert": renderPercentFilter,
      "opacity": renderPercentFilter,
      "sepia": renderPercentFilter,
      "saturate": filter => renderPercentFilter(filter, 1000),
    }[filter.name];

    return <div>
      { renderer && renderer(filter) }
    </div>
  }
}

class StylePropertyPreviewComponent extends React.Component<{ renderer(): any }, any> {
  render() {
    const { renderer } = this.props;
    return <div className="property-preview">
      <div className="card" style={{ visibility: !!renderer ? "visible" : "hidden" }}>
        <div className="body">
          { renderer && renderer() }
        </div>
      </div>
      <div className="contentt">
        { this.props.children }
      </div>
    </div>
  }
}

class LayoutSectionComponent extends SectionComponent<ISectionComponentProps> {  
  
  componentDidMount() {
    // if (process.env.SANDBOXED) {
    //   this.openPopup("Advanced", this.renderAdvancedSection);
    // }
  }

  renderMainSection() {
    const { rule, graphics } = this.props;
    return <div className="container section" key="layout">

      <div>
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
              <Select placeholder="--" options={DISPLAY_OPTIONS} clearable={true} value={graphics.display} onChange={bindGraphicSelectChange(graphics, "display")} optionRenderer={createPreviewMenuOption(DISPLAY_PREVIEWS)} />
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
              <TextInputComponent value={graphics.left && graphics.left.toString()} onChange={bindGraphicsValueChange(graphics, "left")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="top">
              Top
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="top" block={true}> 
              <TextInputComponent value={graphics.top && graphics.top.toString()} onChange={bindGraphicsValueChange(graphics, "top")} />
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
              <TextInputComponent value={graphics.width && graphics.width.toString()} onChange={bindGraphicsValueChange(graphics, "width")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="height">
              Height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="height" block={true}> 
              <TextInputComponent value={graphics.height && graphics.height.toString()} onChange={bindGraphicsValueChange(graphics, "height")} />
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
              <TextInputComponent value={graphics.minWidth} onChange={bindGraphicsValueChange(graphics, "minWidth")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="minHeight">
              Min height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="minheight" block={true}> 
              <TextInputComponent value={graphics.minHeight} onChange={bindGraphicsValueChange(graphics, "minHeight")} />
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
              <TextInputComponent value={graphics.maxWidth} onChange={bindGraphicsValueChange(graphics, "maxWidth")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="maxHeight">
              Max height
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="maxHeight" block={true}> 
              <TextInputComponent value={graphics.maxHeight} onChange={bindGraphicsValueChange(graphics, "maxHeight")} />
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
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="overflow" block={true}> 
              <Select options={LAYOUT_OVERFLOW_OPTIONS} placeholder="--" value={graphics.overflow} onChange={bindGraphicSelectChange(graphics, "overflow")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2-5 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="overflow">
              Float
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-3-5">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="float" block={true}> 
              <Select options={FLOAT_OPTIONS} placeholder="--" value={graphics.float} onChange={bindGraphicSelectChange(graphics, "float")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
      </div>
    </div>
  }
}

class FlexContainerSectionComponent extends SectionComponent<ISectionComponentProps> {  
  
  componentDidMount() {
    if (process.env.SANDBOXED) {
      this.openPopup("Advanced", this.renderAdvancedSection);
    }
  }

  renderMainSection() {
    const { graphics, rule } = this.props;
    if (graphics.display !== "flex") return null;
    return <div className="container">
      <div className="row title">
        <div className="col-12">
          Flex Container

          <div className="controls">
            <i className="ion-more" onClick={() => {
              this.openPopup("Advanced", this.renderAdvancedSection);
            }} />
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-2 label">
          Direction
        </div>
        <div className="col-4">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="flexDirection" block={true}> 
            <Select options={FLEX_DIRECTION_OPTIONS} placeholder="--" value={rule.style.flexDirection} onChange={bindMergedRuleSelectChange(rule, "flexDirection")} optionRenderer={createPreviewMenuOption(FLEX_DIRECTION_PREVIEWS)} />
          </CSSHighlightTargetRuleHintComponent>
        </div>
        <div className="col-2 label">
          Wrap
        </div>
        <div className="col-4">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="flexWrap" block={true}>
            <Select options={FLEX_WRAP_OPTIONS} placeholder="--" value={rule.style.flexWrap} onChange={bindMergedRuleSelectChange(rule, "flexWrap")} optionRenderer={createPreviewMenuOption(FLEX_WRAP_PREVIEWS)}  />
          </CSSHighlightTargetRuleHintComponent>
        </div>

      </div>
      <div className="row">
        <div className="col-2 label">
          Justify
        </div>
        <div className="col-4">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="justifyContent" block={true}>
            <Select options={FLEX_JUSTIFY_CONTENT_OPTIONS} placeholder="--" value={rule.style.justifyContent} onChange={bindMergedRuleSelectChange(rule, "justifyContent")} optionRenderer={createPreviewMenuOption(FLEX_JUSTIFY_CONTENT_OPTIONS)}  />
          </CSSHighlightTargetRuleHintComponent>
        </div>
        <div className="col-6">
        </div>
      </div>
     
    </div>
  }

  renderAdvancedSection = () => {
    const { rule } = this.props;
    return <div>
      <div className="row">
        <div className="col-4 label">
          Align items
        </div>
        <div className="col-8">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="alignItems" block={true}>
            <Select options={FLEX_ALIGN_ITEMS_OPTIONS} placeholder="--" value={rule.style.alignItems} onChange={bindMergedRuleSelectChange(rule, "alignItems")} optionRenderer={createPreviewMenuOption(FLEX_ALIGN_ITEMS_PREVIEWS)}  />
          </CSSHighlightTargetRuleHintComponent>
        </div>
      </div>

      <div className="row">
        <div className="col-4 label">
          Align content
        </div>
        <div className="col-8">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="alignContent" block={true}>
            <Select options={FLEX_ALIGN_CONTENT_OPTIONS} placeholder="--" value={rule.style.alignContent} onChange={bindMergedRuleSelectChange(rule, "alignContent")} optionRenderer={createPreviewMenuOption(FLEX_ALIGN_CONTENT_PREVIEWS)}  />
          </CSSHighlightTargetRuleHintComponent>
        </div>
      </div>
    </div>
  }
}

class FlexContainerChildSectionComponent extends SectionComponent<ISectionComponentProps> {  
  
  componentDidMount() {
    // if (process.env.SANDBOXED) {
    //   this.openPopup("Advanced", this.renderAdvancedSection);
    // }
  }
  renderMainSection() {

    // OTHERS - align-self, flex, flex-basis
    const { graphics, rule } = this.props;

    // yuck - checking computed property here just to get it to work
    if (!rule.target.parentElement || ((rule.target.parentElement as SyntheticHTMLElement).getComputedStyle() || {} as any).display !== "flex") return null;
    return <div className="container">
      <div className="row title">
        <div className="col-12">
          Flex Child
        </div>
      </div>
      <div className="row">
        <div className="col-2 label">
          Grow
        </div>
        <div className="col-4">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="flexGrow" block={true}> 
            <TextInputComponent value={rule.style.flexGrow} onChange={bindMergedRuleValueChange(rule, "flexGrow")} />
          </CSSHighlightTargetRuleHintComponent>
        </div>
        <div className="col-2 label">
          Shrink
        </div>
        <div className="col-4">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="flexShrink" block={true}> 
            <TextInputComponent value={rule.style.flexShrink} onChange={bindMergedRuleValueChange(rule, "flexShrink")} />
          </CSSHighlightTargetRuleHintComponent>
        </div>
      </div>
      <div className="row">
        <div className="col-2 label">
          Order
        </div>
        <div className="col-4">
          <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="order" block={true}> 
            <TextInputComponent value={rule.style.order}  onChange={bindMergedRuleValueChange(rule, "order")} />
          </CSSHighlightTargetRuleHintComponent>
        </div>
        <div className="col-6">
        </div>
      </div>
    </div>;
    // if (!rule.target.parentNode || rule.target.parentNode) return null;
  }
}


class TypographySectionComponent extends SectionComponent<ISectionComponentProps> {

  componentDidMount() {
    // if (process.env.SANDBOXED) {
    //   this.openPopup("Advanced", this.renderAdvancedSection);
    // }
  }

  // TODO - implement this
  previewFont = (option) => {
    // if (option == null) {
    //   this.props.rule.getTargetRule("fontFamily").style.setProperty("fontFamily", this.props.rule.style.fontFamily);
    // } else {
    //   console.log(this.props.rule.getTargetRule("fontFamily").style);
    //   this.props.rule.getTargetRule("fontFamily").style.setProperty("fontFamily", option.value);
    // }
  }

  renderMainSection() {
    const { rule, graphics } = this.props;

    // TODO - preview font on key down
    const renderFontOption = (option) => {
      return <span style={{fontFamily: option.value }} onFocus={this.previewFont.bind(this, option)} onMouseEnter={this.previewFont.bind(this, option)} onMouseLeave={this.previewFont.bind(this, undefined)}>{ option.label }</span>
    };

    return <div className="container section" key="typography">
      <div>
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
              <Select options={this.getFontFamilyOptions()} placeholder="--" value={graphics.fontFamily.length ? graphics.fontFamily[0] : undefined} onChange={bindGraphicSelectChange(graphics, "fontFamily", font => [`'${font}'`])} valueRenderer={renderFontOption} onFocus={this.previewFont} optionRenderer={renderFontOption} />
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
              <TextInputComponent value={rule.style.fontWeight} onChange={bindGraphicsValueChange(graphics, "fontWeight")} />
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
              <TextInputComponent value={graphics.fontSize && graphics.fontSize.toString()} onChange={bindGraphicsValueChange(graphics, "fontSize")} />
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
              <TextInputComponent value={graphics.letterSpacing && graphics.letterSpacing.toString()} onChange={bindGraphicsValueChange(graphics, "letterSpacing")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
          <div className="col-2 label">       
            <CSSMergedRuleLinkComponent rule={rule} propertyName="lineHeight">
              Line
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-4">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="lineHeight" block={true}>
              <TextInputComponent value={graphics.lineHeight && graphics.lineHeight.toString()} onChange={bindGraphicsValueChange(graphics, "lineHeight")} />
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
          <div className="col-3 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="wordWrap">
              Wrap
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-9">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="wordWrap"> 
              <Select options={WORD_WRAP_OPTIONS} placeholder="--" value={graphics.wordWrap} onChange={bindGraphicSelectChange(graphics, "wordWrap")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>        
        <div className="row">
          <div className="col-3 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="wordWrap">
              Overflow
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-9">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="overflow"> 
              <Select options={TEXT_OVERFLOW_OPTIONS} placeholder="--" value={graphics.textOverflow} onChange={bindGraphicSelectChange(graphics, "textOverflow")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
        <div className="row">
          <div className="col-3 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="whiteSpace">
              White space
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-9">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="whiteSpace"> 
              <Select options={WHITE_SPACE_OPTIONS} placeholder="--" value={graphics.whiteSpace} onChange={bindGraphicSelectChange(graphics, "whiteSpace")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
         <div className="row">
          <div className="col-3 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="whiteSpace">
              Decoration
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-9">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="textDecoration"> 
              <Select options={TEXT_DECOR_OPTIONS} placeholder="--" value={graphics.textDecoration} onChange={bindGraphicSelectChange(graphics, "textDecoration")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>

        <div className="row">
          <div className="col-3 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="whiteSpace">
              Style
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-9">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="fontStyle"> 
              <Select options={FONT_STYLE_OPTIONS} placeholder="--" value={graphics.fontStyle} onChange={bindGraphicSelectChange(graphics, "fontStyle")} />
            </CSSHighlightTargetRuleHintComponent>
          </div>
        </div>
        
        <div className="row">
          <div className="col-3 label">
            <CSSMergedRuleLinkComponent rule={rule} propertyName="whiteSpace">
              Transform
            </CSSMergedRuleLinkComponent>
          </div>
          <div className="col-9">
            <CSSHighlightTargetRuleHintComponent rule={rule} propertyName="textTransform"> 
              <Select options={TEXT_TRANSFORM_OPTIONS} placeholder="--" value={graphics.textTransform} onChange={bindGraphicSelectChange(graphics, "textTransform")} />
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
          <ChromePicker color={graphics.color && graphics.color.toString()} onChange={(color) => graphics.color = new SyntheticCSSColor(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a)} />
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

    return <div className="container background-section">
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
    </div>;
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
            <TextInputComponent value={background.size} onChange={bindGraphicsValueChange(background, "size")} />
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

class BoxShadowsSectionComponent extends SectionComponent<ISectionComponentProps> {

  private _selectedBoxShadowIndex: number = -1;

  componentDidMount() {
    // if (process.env.SANDBOXED) {
    //   this._selectedBoxShadowIndex = 0;
    //   this.openPopup("Options", this.renderShadowOptions);
    // }
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

    return <div className="container">
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
    </div>;
  }

  renderShadowOptions = () => {
    const boxShadow = this.props.graphics.boxShadows[this._selectedBoxShadowIndex] || new SyntheticCSSStyleBoxShadow([0, 0, 0, 0, new SyntheticCSSColor(0, 0, 0, 1)])
    if (!boxShadow) return null;


    return <CSSShadowInputComponent target={boxShadow} />;
  }
}

class CSSShadowInputComponent extends React.Component<{ target: SyntheticCSSStyleBoxShadow|SyntheticDropShadowFilter }, any> {
  render() {
    const { target } = this.props;
    return <div> 
       <div>
        <div className="row">
          <div className="col-12">
            { !process.env.HIDE_COLOR_PICKER ? <ChromePicker color={target.color.toString()} onChange={({ rgb }) => {
              target.color = SyntheticCSSColor.fromRGBA(rgb);
            }} /> : null }
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-2 label">
          X
        </div>
        <div className="col-4">
          <TextInputComponent value={target.x} onChange={bindGraphicsValueChange(target, "x")} />
        </div>
        <div className="col-2 label">
          Y
        </div>
        <div className="col-4">
          <TextInputComponent value={target.x} onChange={bindGraphicsValueChange(target, "y")} />
        </div>
      </div>
      <div className="row">
        <div className="col-2 label">
          Blur
        </div>
        <div className="col-4">
          <TextInputComponent value={target.blur} onChange={bindGraphicsValueChange(target, "blur")} />
        </div>
        <div className="col-2 label">
          Spread
        </div>
        <div className="col-4">
          <TextInputComponent value={target.spread} onChange={bindGraphicsValueChange(target, "spread")} />
        </div>
      </div>
      <div className="row" style={{display: target instanceof SyntheticCSSStyleBoxShadow ? "block" : "none" }}>
        <div className="col-2 label">
          Inset
        </div>
        <div className="col-4">
          <BetterCheckbox checked={target["inset"]} onChange={bindGraphicsValueChange(target, "inset")} />
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

class CSSBoxSectionComponent extends SectionComponent<ISectionComponentProps> {
  
  private _selectedBoxName: string;
  
  selectBox(name: string) {
    this._selectedBoxName = name;
    if (name) {
      this.openPopup(name, this.renderBoxInputs);
    } else {
      this.closePopup();
    }
  }

  componentDidMount() {
    if (process.env.SANDBOXED) {
      // this.selectBox("padding");
    }
  }

  onClosePopup() {
    this._selectedBoxName = undefined;
  }

  renderMainSection() {
    const selectedBox = this._selectedBoxName;

    return <div className="container box-section">
      <div className="row title">
        <div className="col-12">
          Box
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="box-input">
            {
              this.renderBox(
                "margin",
                this.renderBox(
                  "border",
                  this.renderBox(
                    "padding",
                    this.renderBox(
                      "content"
                    )
                  )
                ) 
              )
            }
          </div>
        </div>
      </div>
    </div>
  }

  renderBoxInputs = () => {
    if (!this._selectedBoxName) return null;
    if (this._selectedBoxName === "border") return this.renderBorderInputs();
    return this.renderSpacedInput();
  }

  renderBorderInputs() {
    return <div>
      BORDER
    </div>
  }

  renderSpacedInput() {
    const box = {} as any;
    
    return <div className="inputs-section">
      <div className="row">
        <div className="col-2 label">
          left
        </div>
        <div className="col-4">
          <TextInputComponent value={box.top} onChange={bindGraphicsValueChange(box, "left")} />
        </div>
        <div className="col-2 label">
          right
        </div>
        <div className="col-4">
          <TextInputComponent value={box.top} onChange={bindGraphicsValueChange(box, "right")} />
        </div>
      </div>
      <div className="row">
        <div className="col-2 label">
          top
        </div>
        <div className="col-4">
          <TextInputComponent value={box.top} onChange={bindGraphicsValueChange(box, "top")} />
        </div>
        <div className="col-2 label">
          bottom
        </div>
        <div className="col-4">
          <TextInputComponent value={box.bottom} onChange={bindGraphicsValueChange(box, "bottom")} />
        </div>
      </div>
    </div>
  }
  
  renderBox(name: string, child?: any) {
    const classNames = cx({ "focused": name === this._selectedBoxName, box: true, [name]: true, "not-nested": true });

    return <div className={classNames} onClick={(event) => {
      event.stopPropagation();
      this.selectBox(name);
    }}>
      <label>{ name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase() }</label>

      <div className="top value">
        10
      </div>
      
      <div className="left value">
        10
      </div>

      <div className="right value">
        10
      </div>
      
      <div className="bottom value">
        10
      </div>

      { child }
    </div>
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
export class CSSUnitInput extends TextInputComponent {
  // TODO 
}

class CSSFilterInputComponent extends React.Component<{ filter: SyntheticCSSFilter, select: (filter: SyntheticCSSFilter) => any, rename: (filter: SyntheticCSSFilter, newName: string) => any }, any> {
  render() {
    const { filter } = this.props;
    const { name, params } = filter;
    return <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="col-1">
            <div className="filter-config-button">
              <i className="ion-wand" onClick={() => {
                this.props.select(filter);
              }} />
            </div>
          </div>
          <div className="col-11">
            <Select options={CSS_FILTER_OPTIONS} placeholder="--" value={filter.name} onChange={(option) => {
              if (option) this.props.rename(filter, (option as any).value);
            }} />
          </div>
        </div>
      </div>
    </div>
  }

  renderInput(name: string, params: any[]) {
    return <TextInputComponent value={params && params[0]} onChange={() => {}} />
  }
}

class BackgroundFillComponent extends React.Component<{ value: string, onClick?: () => any }, any> {
  render() {
    const { value } = this.props;
    return <div className="fill-input" onClick={this.props.onClick} style={{background: value }}>
    </div>
  }
}