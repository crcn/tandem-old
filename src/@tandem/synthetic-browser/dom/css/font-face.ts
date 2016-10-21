import { CSSATRuleExpression } from "./ast";
import { SyntheticCSSStyleRule } from "./style-rule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import { ISerializer, deserialize, serializable, serialize, ISerializedContent } from "@tandem/common";

export interface ISerializedSyntheticCSSFontFace {
  declaration: ISerializedContent<any>;
}

class SyntheticCSSFontFaceSerializer implements ISerializer<SyntheticCSSFontFace, ISerializedSyntheticCSSFontFace> {
  serialize({ declaration }: SyntheticCSSFontFace) {
    return {
      declaration: serialize(declaration)
    };
  }
  deserialize({ declaration }: ISerializedSyntheticCSSFontFace, dependencies) {
    const rule = new SyntheticCSSFontFace();
    rule.declaration = deserialize(declaration, dependencies);
    return rule;
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSFontFaceSerializer()))
export class SyntheticCSSFontFace extends SyntheticCSSObject {
  public declaration: SyntheticCSSStyleDeclaration;
  get cssText() {
    return `@font-face {
      ${this.declaration.cssText}
    }`;
  }
}