import { File } from "sf-common/models";
import { IActor } from "sf-core/actors";
import { IEntity } from "sf-core/ast/entities";
import { Workspace } from "./workspace";
import { IInjectable } from "sf-core/dependencies";
import { IDisposable } from "sf-core/object";
import { watchProperty } from "sf-core/observable";
import { IEntityDocument } from "sf-core/ast";
import { IPoint, Transform } from "sf-core/geom";
import { Action, PropertyChangeAction } from "sf-core/actions";

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

export abstract class DocumentFile<T extends IEntity> extends File implements IEntityDocument {

  constructor() {
    super();
    watchProperty(this, "content", this._onContentChange).trigger();
  }

  private _entity: T;

  public get entity(): T {
    return this._entity;
  }

  protected abstract createEntity(content: string): T;

  private _onContentChange = async (content: string) => {
    const entity = this.createEntity(content);
    entity.document = this;
    await entity.load();
    if (this._entity && this._entity.constructor === entity.constructor) {
      this._entity.patch(entity);
    } else {
      const oldEntity = this._entity;
      this._entity = entity;
      this.notify(new PropertyChangeAction("entity", entity, oldEntity));
    }
  }

  async update() {
    this._entity.update();
    this.content = this._entity.source.toString();
    return super.update();
  }
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
}

export interface IHistoryItem {
  use(): void;
}