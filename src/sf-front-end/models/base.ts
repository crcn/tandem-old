import { File } from "sf-common/models";
import { IActor } from "sf-core/actors";
import { Action } from "sf-core/actions";
import { Workspace } from "./workspace";
import { IInjectable } from "sf-core/dependencies";
import { IDisposable } from "sf-core/object";
import { IPosition, Transform } from "sf-core/geom";
import { IEntity, IEntityDocument } from "sf-core/entities";

export interface IEditorTool extends IActor, IDisposable {
  readonly editor: IEditor;
  readonly name: string;
  readonly cursor: string;
}

export interface IEditor extends IActor {
  currentTool: IEditorTool;
  transform: Transform;
  readonly type: string;
  readonly cursor: string;
  activeEntity: IEntity;

  readonly workspace: Workspace;
}

export abstract class DocumentFile extends File {
  readonly document: IEntityDocument;
}

export abstract class BaseEditorTool implements IEditorTool, IInjectable {
  abstract name: string;
  readonly cursor: string = undefined;
  constructor(readonly editor: IEditor) { }

  dispose() { }

  get workspace(): Workspace {
    return this.editor.workspace;
  }

  execute(action: Action) {
    if (this[action.type]) {
      return this[action.type](action);
    }
  }

  didInject() { }
}