import { ISerializer, serialize, deserialize, ITreeWalker } from "@tandem/common";
import {
  IEditable,
  EditAction,
  BaseContentEdit,
  ISyntheticObject,
  ISyntheticSourceInfo,
  generateSyntheticUID,
  SyntheticObjectSerializer,
} from "@tandem/sandbox";


export abstract class SyntheticCSSObject implements ISyntheticObject, IEditable {

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

  clone(deep?: boolean) {
    if (deep) return deserialize(serialize(this), null);
    return this.$linkClone(this.cloneShallow());
  }

  public $linkClone(clone: SyntheticCSSObject) {
    clone.$source = this.$source;
    clone.$uid    = this.$uid;
    return clone;
  }

  protected abstract cloneShallow();
  abstract createEdit(): BaseContentEdit<SyntheticCSSObject>;
  abstract applyEditAction(action: EditAction);
  abstract visitWalker(walker: ITreeWalker);
}

export const SyntheticCSSObjectSerializer = SyntheticObjectSerializer;