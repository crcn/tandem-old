import { CSSExpression } from "./ast";
import { ISerializer, serialize, deserialize } from "@tandem/common";
import {
  BaseContentEdit,
  ISyntheticObject,
  ISyntheticSourceInfo,
  generateSyntheticUID,
  SyntheticObjectSerializer,
} from "@tandem/sandbox";


export abstract class SyntheticCSSObject implements ISyntheticObject {

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

export const SyntheticCSSObjectSerializer = SyntheticObjectSerializer;