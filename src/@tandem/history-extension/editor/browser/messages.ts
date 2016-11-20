import { Action } from "@tandem/common";

export class UndoAction extends Action {
  static readonly UNDO = "undo";
  constructor() {
    super(UndoAction.UNDO);
  }
}

export class RedoAction extends Action {
  static readonly REDO = "redo";
  constructor() {
    super(RedoAction.REDO);
  }
}