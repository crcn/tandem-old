import { DOMElements } from "./dom-elements";
import { SyntheticHTMLElement, SyntheticCSSStyle, DOMNodeType } from "@tandem/synthetic-browser";

export class HTMLDOMElements extends DOMElements<SyntheticHTMLElement> {

  get style(): SyntheticCSSStyle {
    const allStyle = {};
    for (const item of <SyntheticHTMLElement[]><any>this) {
      const itemStyle =  item.style;
      for (const name of itemStyle.getProperties()) {
        if (allStyle[name]) {
          allStyle[name] = "multiple values";
        } else {
          allStyle[name] = itemStyle[name];
        }
      }
    }
    return SyntheticCSSStyle.fromObject(allStyle);
  }

  static fromArray(items: any): HTMLDOMElements {
    return HTMLDOMElements.create(...items.filter((item) => {
      return item.nodeType === DOMNodeType.ELEMENT &&  !!(<SyntheticHTMLElement>item.style);
    })) as HTMLDOMElements;
  }
}