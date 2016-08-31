import { File } from "sf-common/models";
import { inject } from "sf-core/decorators";
import { IActor } from "sf-core/actors";
import { IEntity } from "sf-core/ast/entities";
import { BubbleBus } from "sf-core/busses";
import { Workspace } from "./workspace";
import { IObservable } from "sf-core/observable";
import { IDisposable } from "sf-core/object";
import { IExpression } from "sf-core/ast";
import { IPoint, Transform } from "sf-core/geom";
import { IEntityDocument, patchSource } from "sf-core/ast";
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
  private _ast: IExpression;

  public get entity(): T {
    return this._entity;
  }

  deserialize(data: any) {
    const oldContent = this.content;
    super.deserialize(data);

    // reload
    // TODO - reload on any change
    if (oldContent !== this.content && this._entity) {
      this.load();
    }
  }

  public async load() {
    const entity = this.createEntity(this._ast = this.parse(this.content));
    entity.document = this;
    await entity.load();
    if (this._entity && this._entity.constructor === entity.constructor) {
      this._entity.patch(entity);
    } else {
      const oldEntity = this._entity;
      this._entity = entity;
      this._entity.observe(new BubbleBus(this));
      this.notify(new PropertyChangeAction("entity", entity, oldEntity));
    }
  }

  abstract parse(content: string): IExpression;
  protected abstract getFormattedContent(ast: IExpression): string;
  protected abstract createEntity(ast: IExpression): T;

  async update() {
    this._entity.update();
    this.content = this.getFormattedContent(this._ast);
    // this.content = patchSource(this.content, this.parse(this.content), this._ast);
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