import { CSSExpression } from "./ast";
import { ISerializer, serialize, deserialize } from "@tandem/common";
import {
  ISynthetic,
  BaseContentEdit,
  ISyntheticSourceInfo,
  generateSyntheticUID,
} from "@tandem/sandbox";


export abstract class SyntheticCSSObject implements ISynthetic {

  public $source: ISyntheticSourceInfo;
  readonly uid: any;

  constructor() {
    this.uid = generateSyntheticUID();
  }

  get source() {
    return this.$source;
  }

  abstract clone(deep?: boolean);

  protected linkClone(clone: SyntheticCSSObject) {
    clone.$source = this.source;
    return clone;
  }

  abstract createEdit(): BaseContentEdit<SyntheticCSSObject>;
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