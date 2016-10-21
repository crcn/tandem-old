import { CSSRuleExpression } from "./ast";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { SyntheticCSSStyleRule, ISerializedSyntheticCSSStyleRule } from "./style-rule";
import {
  serialize,
  deserialize,
  ISerializer,
  serializable,
  ISourceLocation,
  ISerializedContent
} from "@tandem/common";

import { Bundle } from "@tandem/sandbox";

export interface ISerializedCSSStyleSheet {
  location: ISourceLocation;
  bundle: any;
  rules: Array<ISerializedContent<ISerializedSyntheticCSSStyleRule>>;
}

class SyntheticCSSStyleSheetSerializer implements ISerializer<SyntheticCSSStyleSheet, ISerializedCSSStyleSheet> {
  serialize(value: SyntheticCSSStyleSheet): ISerializedCSSStyleSheet {
    return {
      location: value.$location,
      bundle: serialize(value.bundle),
      rules: value.rules.map(serialize)
    };
  }
  deserialize(value: ISerializedCSSStyleSheet, dependencies): SyntheticCSSStyleSheet {
    const styleSheet = new SyntheticCSSStyleSheet(value.rules.map(raw => deserialize(raw, dependencies)));
    styleSheet.$bundle = deserialize(value.bundle, dependencies);
    return styleSheet;
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSStyleSheetSerializer()))
export class SyntheticCSSStyleSheet extends SyntheticCSSObject {

  public $bundle: Bundle;

  constructor(readonly rules: SyntheticCSSStyleRule[]) {
    super();
  }

  get bundle() {
    return this.$bundle;
  }

  get cssText() {
    return this.rules.map((rule) => rule.cssText).join("\n");
  }

  toString() {
    return this.cssText;
  }
}