import { CSSExpression } from "./ast";
import { Bundle, ISynthetic, ISyntheticSourceInfo } from "@tandem/sandbox";
import { ISerializer, serialize, deserialize } from "@tandem/common";

export class SyntheticCSSObject implements ISynthetic {

  public $source: ISyntheticSourceInfo;

  get source() {
    return this.$source;
  }

  get editable() {
    return !!this.source;
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