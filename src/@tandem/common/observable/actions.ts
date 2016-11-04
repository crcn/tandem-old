import { Action } from "@tandem/common/actions";
import { ArrayDiff } from "@tandem/common/utils/array";

export class ArrayChangeAction<T> extends Action {
  static readonly ARRAY_CHANGE = "arrayChange";
  constructor(readonly diff: ArrayDiff<T>) {
    super(ArrayChangeAction.ARRAY_CHANGE);
  }
}