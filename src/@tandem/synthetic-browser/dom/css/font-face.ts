import { SyntheticCSSStyleRule } from "./style-rule";
import { BaseContentEdit } from "@tandem/sandbox";
import { SyntheticCSSAtRule } from "./atrule";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import {
  Mutation,
  serialize,
  ITreeWalker,
  ISerializer,
  deserialize,
  serializable,
  ISerializedContent,
} from "@tandem/common";

export interface ISerializedSyntheticCSSFontFace {
  declaration: ISerializedContent<any>;
}

export class FontFaceEdit extends BaseContentEdit<SyntheticCSSFontFace> {
  addDiff(newAtRule: SyntheticCSSFontFace) {
    return this;
  }
}

class SyntheticCSSFontFaceSerializer implements ISerializer<SyntheticCSSFontFace, ISerializedSyntheticCSSFontFace> {
  serialize({ declaration }: SyntheticCSSFontFace) {
    return {
      declaration: serialize(declaration)
    };
  }
  deserialize({ declaration }: ISerializedSyntheticCSSFontFace, injector) {
    return new SyntheticCSSFontFace(deserialize(declaration, injector));
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSFontFaceSerializer()))
export class SyntheticCSSFontFace extends SyntheticCSSAtRule {

  readonly atRuleName = "font-face";

  constructor(public declaration: SyntheticCSSStyleDeclaration) {
    super();
    declaration.$parentRule = this;
  }

  get params() {
    return "";
  }

  get cssText() {
    return `@font-face {
      ${this.declaration.cssText}
    }`;
  }
  cloneShallow() {
    return new SyntheticCSSFontFace(new SyntheticCSSStyleDeclaration());
  }

  countShallowDiffs(target: SyntheticCSSFontFace) {
    return this.cssText === target.cssText ? 0 : -1;
  }

  applyMutation(action: Mutation<any>) {
    console.warn(`Cannot currently edit ${this.constructor.name}`);
  }

  createEdit() {
    return new FontFaceEdit(this);
  }
  visitWalker(walker: ITreeWalker) {
    walker.accept(this.declaration);
  }
}