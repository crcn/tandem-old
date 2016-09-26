import { SyntheticNode, SyntheticContainerNode } from "./node";
import { synthetic, SyntheticValueObject, SyntheticObject, SyntheticArray, ISynthetic } from "../core";

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
  constructor(tagName: SyntheticValueObject<string>) {
    super(tagName);
    this.set("attributes", new SyntheticAttributes());
  }

  get attributes(): SyntheticAttributes {
    return this.get<SyntheticAttributes>("attributes");
  }

  get outerHTML() {
    const buffer = [
      "<", this.nodeName.value
    ];

    for (const attribute of this.attributes.value) {
      buffer.push(` ${attribute.name}=${attribute.value}`);
    }

    buffer.push(">", this.innerHTML, "</", this.nodeName.value, ">");

    return buffer.join("");
  }

  @synthetic setAttribute(name: SyntheticValueObject<string>, value: ISynthetic) {
    this.get("attributes").set(name.value, value);
  }

  @synthetic getAttribute(name: SyntheticValueObject<string>) {
    return this.get("attributes").get(name.value).get("value");
  }
}