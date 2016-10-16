import {
  DOMNodeType,
  SyntheticDOMNode,
  BaseDOMNodeEntity,
  SyntheticDOMElement,
  SyntheticDOMAttributes,
} from "@tandem/synthetic-browser";


export class DOMElementEntityCollection extends Array<BaseDOMNodeEntity<SyntheticDOMElement, any>> {
  constructor(...items: Array<BaseDOMNodeEntity<SyntheticDOMNode, any>>) {
    super(...items.filter((entity) => entity.source && entity.source.nodeType === DOMNodeType.ELEMENT) as any);
  }

  setAttribute(name: string, value: string) {
    for (const entity of this) {
      entity.change.setAttribute(name, value);
    }
  }

  get attributes(): SyntheticDOMAttributes {
    const attributes = new SyntheticDOMAttributes();
    for (const entity of this) {
      for (const attribute of entity.change.attributes) {
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
    await Promise.all(this.map((entity) => entity.save()));
  }
}