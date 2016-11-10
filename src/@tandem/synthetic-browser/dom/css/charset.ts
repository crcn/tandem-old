import { SyntheticCSSObject, SyntheticCSSObjectEdit } from "./base";
import { ITreeWalker, serializable } from "@tandem/common";

@serializable({
  serialize({ value }: SyntheticCSSCharset) {
    return { value };
  },
  deserialize({ value }): SyntheticCSSCharset {
    return new SyntheticCSSCharset(value);
  }
})
export class SyntheticCSSCharset extends  SyntheticCSSObject {
  constructor(readonly value: string) {
    super();
  }
  cloneShallow() {
    return new SyntheticCSSCharset(this.value);
  }
  get cssText() {
    return `@charset ${this.value};`;
  }
  countShallowDiffs(charset: SyntheticCSSCharset) {
    return charset.value === this.value ? 0 : -1;
  }
  applyEditAction(action) {
    // do nothing
  }
  createEdit() {
    return new SyntheticCSSObjectEdit<SyntheticCSSCharset>(this);
  }
  visitWalker(walker: ITreeWalker) { }
}