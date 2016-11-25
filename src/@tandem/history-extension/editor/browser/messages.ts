import { Message } from "@tandem/mesh";

export class UndoAction extends Message {
  static readonly UNDO = "undo";
  constructor() {
    super(UndoAction.UNDO);
  }
}

export class RedoAction extends Message {
  static readonly REDO = "redo";
  constructor() {
    super(RedoAction.REDO);
  }
}