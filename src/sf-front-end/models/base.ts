import { File } from "sf-common/models";
import { inject } from "sf-core/decorators";
import { IActor } from "sf-core/actors";
import { IEntity } from "sf-core/ast/entities";
import { BubbleBus } from "sf-core/busses";
import { Workspace } from "./workspace";
import { IObservable } from "sf-core/observable";
import { IDisposable } from "sf-core/object";
import { IEntityDocument } from "sf-core/ast";
import { IPoint, Transform } from "sf-core/geom";
import { Action, PropertyChangeAction } from "sf-core/actions";
import { IInjectable, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";

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

export abstract class DocumentFile<T extends IEntity & IObservable> extends File implements IEntityDocument {

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

  private _entity: T;

  public get entity(): T {
    return this._entity;
  }

  public async load() {
    const entity = this.createEntity(this.content);
    entity.document = this;
    await entity.load();
    if (this._entity && this._entity.constructor === entity.constructor) {
      this._entity.patch(entity);
      this._entity.observe(new BubbleBus(this));
    } else {
      const oldEntity = this._entity;
      this._entity = entity;
      this.notify(new PropertyChangeAction("entity", entity, oldEntity));
    }
  }

  protected abstract createEntity(content: string): T;
  protected formatContent(content: string) {
    return content;
  }

  async update() {
    this._entity.update();
    this.content = this.formatContent(this._entity.source.toString());
    await super.update();
    await this.load();
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