import { evaluateHTML } from "./evaluate-html";
import { HTMLNodeType } from "./node-types";
import { SyntheticDocument } from "./document";
import { parse as parseHTML } from "./html-parser.peg";
import { SyntheticNode, SyntheticContainerNode } from "./node";
import { synthetic, SyntheticValueObject, SyntheticString, SyntheticObject, SyntheticArray, ISynthetic } from "../core";

class SyntheticAttribute extends SyntheticObject {
  constructor(name: SyntheticValueObject<string>, value: SyntheticValueObject<string>) {
    super({ name, value });
  }

  get name(): SyntheticValueObject<string> {
    return this.get<SyntheticValueObject<string>>("name");
  }

  get value(): SyntheticValueObject<string> {
    return this.get<SyntheticValueObject<string>>("value");
  }
}

class SyntheticAttributes extends SyntheticArray<SyntheticAttribute> {
  constructor() {
    super();
  }

  get(name: string|number) {
    return this.value.find((attribute, index) => attribute.get<SyntheticValueObject<string>>("name").value === name || index === name) || new SyntheticValueObject(undefined);
  }

  set(name: string|number, value: SyntheticValueObject<string>) {
    const attribute = this.get(name);
    if (attribute instanceof SyntheticAttribute) {
      attribute.set("value", value);
    } else {
      this.value.push(new SyntheticAttribute(new SyntheticValueObject<any>(name), value));
    }
  }
}

interface ISyntheticElement {
  get(propertyname: "attribute"): SyntheticAttributes;
}

export class SyntheticElement extends SyntheticContainerNode implements ISyntheticElement {
  readonly nodeType = HTMLNodeType.ELEMENT;
  constructor(tagName: SyntheticValueObject<string>, doc: SyntheticDocument) {
    super(tagName, doc);
    this.set("attributes", new SyntheticAttributes());
  }

  get attributes(): SyntheticAttributes {
    return this.get<SyntheticAttributes>("attributes");
  }

  @synthetic
  get innerHTML() {
    return new SyntheticString(this.childNodes.value.map(child => child.outerHTML).join(""));
  }

  set innerHTML(value: SyntheticString) {

    // TODO - value needs to be SyntheticString here
    const ast = parseHTML(value.toString());
    const node = evaluateHTML(ast, this.ownerDocument) as SyntheticContainerNode;

    for (const child of node.childNodes.value) {
      this.appendChild(child);
    }
  }

  get outerHTML(): SyntheticString {
    const buffer = [
      "<", this.nodeName.value
    ];

    for (const attribute of this.attributes.value) {
      buffer.push(` ${attribute.name}=${attribute.value}`);
    }

    buffer.push(">", this.innerHTML.toString(), "</", this.nodeName.value, ">");

    return new SyntheticString(buffer.join(""));
  }

  @synthetic setAttribute(name: SyntheticValueObject<string>, value: ISynthetic) {
    this.get("attributes").set(name.value, value);
  }

  @synthetic getAttribute(name: SyntheticValueObject<string>) {
    return this.get("attributes").get(name.value).get("value");
  }
}