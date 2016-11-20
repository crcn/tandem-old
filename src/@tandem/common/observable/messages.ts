import { Action } from "@tandem/common/messages";
import { ArrayDiff } from "@tandem/common/utils/array";

export class ArrayMetadataChangeEvent<T> extends Action {
  static readonly ARRAY_CHANGE = "arrayChange";
  constructor(readonly diff: ArrayDiff<T>) {
    super(ArrayMetadataChangeEvent.ARRAY_CHANGE);
  }
}