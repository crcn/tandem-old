import {
  DOMNodeType,
  SyntheticDOMNode,
  SyntheticDOMElement,
  SyntheticDOMAttributes,
} from "@tandem/synthetic-browser";


export class DOMElementCollection extends Array<SyntheticDOMElement> {
  constructor(...items: Array<SyntheticDOMElement>) {
    super(...items.filter((element) => element && element.nodeType === DOMNodeType.ELEMENT) as any);
  }

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
}