/**
 * The data model for style declarations
 */

import { SyntheticCSSStyle } from "../style";
import { 
  evaluateCSSDeclValue, 
  parseCSSDeclValue, 
  SyntheticCSSColor,   
  SyntheticCSSMeasurment,
} from "./declaration";
export * from "./declaration";

export class SyntheticCSSStylePosition {
  constructor(public left: SyntheticCSSMeasurment, public top: SyntheticCSSMeasurment) {

  }

  toString() {
    if (this.left.value === 0.5 && this.top.value === 0.5) {
      return "center";
    }
  }
}

// blend modes: http://www.w3schools.com/cssref/pr_background-blend-mode.asp
export function isCSSBlendMode(blendMode: string) {
  return /^(normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity)/.test(blendMode);
}

export type CSSBlendModeType = "normal"|"multiply"|"screen"|"overlay"|"darken"|"lighten"|"color-dodge"|"saturation"|"color"|"luminosity";

export class SyntheticCSSStyleBackground {
  public color: SyntheticCSSColor;
  public image: string;
  public position: SyntheticCSSStylePosition;
  public repeat: string;
  public blendMode: CSSBlendModeType;

  constructor(properties?: any) {
    if (properties) this.setProperties(properties);
  }

  setPosition(value: string[]) {
    if (value[0] === "center") {
      this.position = new SyntheticCSSStylePosition(new SyntheticCSSMeasurment(0.5, "%"), new SyntheticCSSMeasurment(0.5, "%"));
    }
  }

  setProperties(properties: any[]) {
    let color, image, blendMode, position = [], repeat;

    for (const value of properties) {
      if (typeof value === "object") {
        if (value instanceof SyntheticCSSColor) {
          color = value;
        }
      } else if(/^(left|top|right|bottom|center)$/.test(value)) {
        position.push(value); 
      } else if(/repeat/.test(value)) {
        repeat = value;
      } else if (isCSSBlendMode(value)) {
        blendMode = value;
      } else {
        image = value;
      }
    }

    if (color) this.color = color;
    if (image) this.image = image;
    if (position.length)  this.setPosition(position);
    if (repeat) this.repeat = repeat;
    if (blendMode) this.blendMode = blendMode;
  }

  toString() {
    const params = [];

    if (this.color) params.push(this.color);
    if (this.image) params.push(this.image);
    if (this.position) params.push(this.position);
    if (this.repeat) params.push(this.repeat);

    return params.join(" ");
  }
}


export class SyntheticCSSStyleBoxShadow {

  public inset: boolean; 
  public x: SyntheticCSSMeasurment; 
  public y: SyntheticCSSMeasurment; 
  public blur: SyntheticCSSMeasurment; 
  public spread: SyntheticCSSMeasurment; 
  public color: SyntheticCSSColor;

  constructor(properties?: any) {
    if (properties) this.setProperties(properties);
  }

  setProperties(properties: any[]) {
    let color, inset, dims = [];

    for (const value of properties) {
      if (value instanceof SyntheticCSSMeasurment || typeof value === "number") {
        dims.push(value);
      } else if (value instanceof SyntheticCSSColor) {
        color = value;
      } else if (value === "inset") {
        inset = true;
      }
    }

    this.color  = color;
    this.inset  = inset;
    this.x      = SyntheticCSSMeasurment.cast(dims[0]);
    this.y      = SyntheticCSSMeasurment.cast(dims[1]);
    this.blur   = SyntheticCSSMeasurment.cast(dims[2]);
    this.spread = SyntheticCSSMeasurment.cast(dims[3]);
  }

  toString() {
    let params = [];
    if (this.inset) {
      params.push("inset");
    }
    params.push(this.x, this.y, this.blur, this.spread, this.color);
    return params.join(" ");
  }
}

export class SyntheticCSSStyleGraphics {
  
  readonly backgrounds: SyntheticCSSStyleBackground[];
  readonly boxShadows: SyntheticCSSStyleBoxShadow[];

  constructor(readonly style: SyntheticCSSStyle) {
    this.backgrounds = [];
    this.boxShadows  = [];
    this.setProperties(style);
  }

  public setProperties(style: SyntheticCSSStyle) {

    const handlers = {
      backgroundColor    : ([value]) => this.primaryBackground.color = value,
      backgroundRepeat   : ([value]) => this.primaryBackground.repeat = value,
      backgroundImage    : ([value]) => this.primaryBackground.image = value,
      backgroundPosition : (value) => this.primaryBackground.setPosition(value),
      background         : (value: any) => {

        // check for background: #F60, #F0F
        if (Array.isArray(value) && Array.isArray(value[0])) {
          for (const background of value) {
            this.addBackground(background);
          }
        } else {
          this.primaryBackground.setProperties(value)
        }
      },
      boxShadow : (value) => {
        if (!Array.isArray(value[0])) value = [value];
        for (const v of value) {
          this.addBoxShadow(v); 
        }
      }
    };
    
    for (const propertyName of style) {
      const rawValue = style[propertyName];
      const value    = evaluateCSSDeclValue(parseCSSDeclValue(rawValue))
      const handler  = handlers[propertyName];
      if (!handler) continue;
      handler(value);
    }
  }

  public get primaryBackground() {
    return this.backgrounds.length ? this.backgrounds[0] : this.addBackground();
  }

  public addBackground(params?: any) {
    const background = new SyntheticCSSStyleBackground(params);
    this.backgrounds.push(background);
    return background;
  }

  public addBoxShadow(params?: any) {
    const boxShadow = new SyntheticCSSStyleBoxShadow(params);
    this.boxShadows.push(boxShadow);
    return boxShadow;
  }

  toStyle() {
    const style = new SyntheticCSSStyle();

    if (this.backgrounds.length) {
      style.background = this.backgrounds.join(", ");
    }

    if (this.boxShadows.length) {
      style.boxShadow = this.boxShadows.join(", ");
    }

    return style;
  }
}