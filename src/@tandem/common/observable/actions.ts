import { Action } from "@tandem/common/actions";

export class ArrayChangeAction extends Action {
  static readonly ARRAY_CHANGE = "arrayChange";
  constructor(readonly removedItems: any[], readonly addedItems: any[]) {
    super(ArrayChangeAction.ARRAY_CHANGE);
  }
}