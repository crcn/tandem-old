import { Action } from "@tandem/common/actions";

export class TreeNodeAction extends Action {
  static readonly NODE_ADDED    = "nodeAdded";
  static readonly NODE_REMOVED  = "nodeRemoved";
}