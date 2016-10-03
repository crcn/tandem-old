import { SyntheticHTMLContainer } from "./container";
import { HTMLNodeType } from "./node-types";
import { evaluateHTML } from "./evaluate-html";
import { parse as parseHTML } from "./html-parser.peg";

export class SyntheticAttribute extends Array {

}

export class SyntheticAttributes extends Array<SyntheticAttribute> {

}

export class SyntheticHTMLElement extends SyntheticHTMLContainer {
  readonly nodeType: number = HTMLNodeType.ELEMENT;
  get innerHTML(): string {
    return null;
  }

  set innerHTML(value: string) {
    this.appendChild(evaluateHTML(parseHTML(value), this.ownerDocument));
  }

  getAttribute(name: string) {

  }

  setAttribute(name: string, value: any) {

  }

  get outerHTML(): string {
    return null;
  }
}