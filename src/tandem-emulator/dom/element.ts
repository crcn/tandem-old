import { SyntheticNode } from "./node";
import { synthetic, SyntheticValueObject, SyntheticObject, SyntheticArray } from "../synthetic";

class SyntheticAttribute extends SyntheticObject {
  constructor(name: SyntheticValueObject<string>, value: SyntheticValueObject<string>) {
    super({ name, value });
  }
}

class SyntheticAttributes extends SyntheticArray<SyntheticAttribute> {
  constructor() {
    super();
  }

  get(name: string|number) {
    return this.value.find((attribute, index) => attribute.get("name").value === name || index === name) || new SyntheticValueObject(undefined);
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

export class SyntheticElement extends SyntheticNode {
  constructor(tagName: string) {
    super(tagName);
    this.set("attributes", new SyntheticAttributes());
  }

  @synthetic setAttribute(name: SyntheticValueObject<string>, value: SyntheticValueObject<string>) {
    this.get("attributes").set(name.value, value);
  }

  @synthetic getAttribute(name: SyntheticValueObject<string>) {
    return this.get("attributes").get(name.value).get("value");
  }
}