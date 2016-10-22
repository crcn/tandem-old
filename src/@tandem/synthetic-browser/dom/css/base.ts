import { CSSExpression } from "./ast";
import { Bundle, ISynthetic, ISyntheticSourceInfo } from "@tandem/sandbox";
import { ISerializer, serialize, deserialize } from "@tandem/common";

export abstract class SyntheticCSSObject implements ISynthetic {

  public $source: ISyntheticSourceInfo;

  get source() {
    return this.$source;
  }

  abstract clone(deep?: boolean);

  protected linkClone(clone: SyntheticCSSObject) {
    clone.$source = this.source;
    return clone;
  }
}

export interface ISerializeCSSObject {
  source: ISyntheticSourceInfo;
}

export class SyntheticCSSObjectSerializer implements ISerializer<SyntheticCSSObject, ISerializeCSSObject> {
  constructor(readonly childSerializer: ISerializer<SyntheticCSSObject, any>) { }
  serialize(value: SyntheticCSSObject) {
    return Object.assign(this.childSerializer.serialize(value), {
      source: value.$source
    });
  }
  deserialize(value: ISerializeCSSObject, dependencies) {
    return Object.assign(this.childSerializer.deserialize(value, dependencies), {
      $source: value.source
    });
  }
}