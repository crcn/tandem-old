import { Action } from "../actions";
import { ISynthetic } from "./index";

export class SyntheticEditAction extends Action {
  constructor(type, readonly item: ISynthetic) {
    super(type);
  }
}

export class RemoveSyntheticEditAction extends SyntheticEditAction {
  static readonly REMOVE_SYNTHETIC = "removeSynthetic";
  constructor(item: ISynthetic) {
    super(RemoveSyntheticEditAction.REMOVE_SYNTHETIC, item);
  }
}