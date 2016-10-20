import { SyntheticCSSStyleRule, ISerializedSyntheticCSSStyleRule } from "./style-rule";
import {
  serialize,
  deserialize,
  ISerializer,
  serializable,
  ISerializedContent
} from "@tandem/common";

export interface ISerializedCSSStyleSheet {
  rules: Array<ISerializedContent<ISerializedSyntheticCSSStyleRule>>;
}

class SyntheticCSSStyleSheetSerializer implements ISerializer<SyntheticCSSStyleSheet, ISerializedCSSStyleSheet> {
  serialize(value: SyntheticCSSStyleSheet): ISerializedCSSStyleSheet {
    return {
      rules: value.rules.map(serialize)
    };
  }
  deserialize(value: ISerializedCSSStyleSheet): SyntheticCSSStyleSheet {
    return new SyntheticCSSStyleSheet(value.rules.map(deserialize));
  }
}

@serializable(new SyntheticCSSStyleSheetSerializer())
export class SyntheticCSSStyleSheet {
  constructor(readonly rules: SyntheticCSSStyleRule[]) { }

  get cssText() {
    return this.rules.map((rule) => rule.cssText).join("\n");
  }

  toString() {
    return this.cssText;
  }
}