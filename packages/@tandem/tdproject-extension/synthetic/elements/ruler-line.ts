import { bindable } from "@tandem/common";
import { SyntheticDOMElement } from "@tandem/synthetic-browser";

export type SyntheticTDRulerLineType = "horizontal" | "vertical";

export class SyntheticTDRulerLineElement extends SyntheticDOMElement {
  get type(): SyntheticTDRulerLineType {
    return this.getAttribute("type");
  }
  set type(value: SyntheticTDRulerLineType) {
    this.setAttribute("type", value);
  }
  get value(): number {
    return Number(this.getAttribute("value") || 0);
  }
  set value(value: number) {
    this.setAttribute("value", String(value));
  }
}