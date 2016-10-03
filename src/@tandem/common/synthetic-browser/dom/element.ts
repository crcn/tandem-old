import { SyntheticNode } from "./node";

export class SyntheticAttribute extends Array {

}

export class SyntheticAttributes extends Array<SyntheticAttribute> {

}

export class SyntheticElement extends SyntheticNode {
  get innerHTML(): string {
    return null;
  }

  set innerHTML(value: string) {

  }

  getAttribute(name: string) {

  }

  setAttribute(name: string, value: any) {

  }

  get outerHTML(): string {
    return null;
  }
}