import { Action } from "@tandem/common/messages";

export class TreeNodeEvent extends Action {
  static readonly NODE_ADDED    = "nodeAdded";
  static readonly NODE_REMOVED  = "nodeRemoved";
}