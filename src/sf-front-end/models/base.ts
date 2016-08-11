import { Action } from "sf-core/actions";
import { IEntity } from "sf-core/entities";
import { IActor } from "sf-core/actors";

export interface IEditorFile {
  ext: string;
  path: string;
  entity: IEntity;
  type: string;
  save();
}

export interface IFileContext {
  file: IEditorFile;
  selection: I
}


export interface IEditor extends IActor {
  currentTool: BaseTool;
}

// export abstract class BaseEditor implements IEditor {
//   constructor(readonly file: IFile) {

//   }
// }

export abstract class BaseTool implements IActor {
  constructor(readonly editor:IEditor) {

  }

  execute(action: Action) {

  }
}