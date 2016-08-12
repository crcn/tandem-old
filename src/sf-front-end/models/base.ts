import { Action } from "sf-core/actions";
import { IActor } from "sf-core/actors";
import { File } from "sf-common/models";
import { IEntity } from "sf-core/entities";
import { Workspace } from "./workspace";

export interface IEditorTool extends IActor {
  readonly editor: IEditor;
  readonly name: string;
  readonly cursor: string;
}

export interface IEditor extends IActor {
  currentTool: IEditorTool;
  readonly type: string;
  readonly workspace: Workspace;
}

export abstract class EntityFile extends File {
  public entity: IEntity;
}

export abstract class BaseEditorTool implements IEditorTool {
  abstract name: string;
  readonly cursor: string = undefined;
  constructor(readonly editor: IEditor) { }

  get workspace(): Workspace {
    return this.editor.workspace;
  }

  execute(action: Action) {
    if (this[action.type]) {
      return this[action.type](action);
    }
  }
}