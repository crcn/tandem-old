import {
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMElement,
  SyntheticDOMAttributes,
} from "@tandem/synthetic-browser";

export class DOMElements extends Array<SyntheticDOMElement> {

  setAttribute(name: string, value: string) {
    for (const element of this) {
      element.setAttribute(name, value);
    }
  }

  get attributes(): SyntheticDOMAttributes {
    const attributes = new SyntheticDOMAttributes();
    for (const element of this) {
      for (const attribute of element.attributes) {
        if (!attributes.hasOwnProperty(attribute.name)) {
          attributes.push(attribute.clone());
        } else {
          attributes[attribute.name].value = "";
        }
      }
    }
    return attributes;
  }

  async save() {
    // await Promise.all(this.map((entity) => entity.save()));
  }

  static fromArray(...items: Array<SyntheticDOMElement>) {
    return new DOMElements(...items.filter((element) => element && element.nodeType === DOMNodeType.ELEMENT) as any);
  }
}