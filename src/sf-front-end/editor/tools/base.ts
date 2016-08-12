import { IActor } from "sf-core/actors";

export interface ITool {
  name: string;
  cursor: string;
}

export abstract class BaseTool implements ITool {
  constructor(readonly name: string, readonly cursor: string = "pointer") {

  }
}

export abstract class BaseInsertTool extends BaseTool {
  constructor(readonly name: string, readonly cursor: string, private _editToolClass:{ new(): ITool }) {
    super(name, cursor);
  }
}