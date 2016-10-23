import { CSSExpression } from "./ast";
import { ISerializer, serialize, deserialize, ITreeWalker } from "@tandem/common";
import {
  BaseContentEdit,
  ISyntheticObject,
  ISyntheticSourceInfo,
  generateSyntheticUID,
  SyntheticObjectSerializer,
} from "@tandem/sandbox";


export abstract class SyntheticCSSObject implements ISyntheticObject {

  public $source: ISyntheticSourceInfo;
  public $uid: any;

  constructor() {
    this.$uid = generateSyntheticUID();
  }

  get uid() {
    return this.$uid;
  }

  get source() {
    return this.$source;
  }

  abstract clone(deep?: boolean);

  protected linkClone(clone: SyntheticCSSObject) {
    clone.$source = this.$source;
    clone.$uid    = this.$uid;
    return clone;
  }

  abstract createEdit(): BaseContentEdit<SyntheticCSSObject>;
  abstract visitWalker(walker: ITreeWalker);
}

export const SyntheticCSSObjectSerializer = SyntheticObjectSerializer;