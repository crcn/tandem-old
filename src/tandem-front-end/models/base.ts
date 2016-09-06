
import { WrapBus } from "mesh";
import { Workspace } from "./workspace";
import { debounce } from "lodash";
import {
  File,
  IPoint,
  inject,
  Action,
  IActor,
  IEntity,
  BubbleBus,
  Transform,
  IDisposable,
  IObservable,
  IExpression,
  IInjectable,
  EntityAction,
  Dependencies,
  patchTreeNode,
  IEntityDocument,
  DEPENDENCIES_NS,
  PropertyChangeAction,
  DependenciesDependency,
  EntityDocumentDependency,
} from "tandem-common";

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

  public owner: IEntityDocument;

  private _entity: T;
  private _ast: IExpression;
  private _sourceContent: string;
  private _entityObserver: IActor;
  private _expressionObserver: IActor;

  constructor(data) {
    super(data);
    this._entityObserver     = new WrapBus(this.onEntityAction.bind(this));
    this._expressionObserver = new WrapBus(this.onExpressionAction.bind(this));
  }

  public get entity(): T {
    return this._entity;
  }

  onContentChange(newContent: string) {
    if (this._sourceContent !== newContent) {
      this.load();
    }
  }

  public async load() {

    // TODO - diff source here and only change
    // what is necessary
    if (this._ast) {
      this._ast.unobserve(this._expressionObserver);
    }

    this._ast =  await this.parse(this._sourceContent = this.content);
    this._ast.source = this;
    this._ast.observe(this._expressionObserver);

    await this.updateEntity();
  }

  abstract async parse(content: string): Promise<IExpression>;
  protected abstract createEntity(ast: IExpression, dependencies: Dependencies): T;

  async save() {
    this._entity.updateSource();
    this.content = this._sourceContent = this._entity.source.toString();
    await super.save();
    await this.updateEntity();
  }

  protected onExpressionAction(action: Action) {
    this.requestSave();
  }

  protected onEntityAction(action: Action) {
    if (action.type === EntityAction.ENTITY_UPDATE) {
      this.requestSave();
    }
    this.notify(action);
  }

  private requestSave = debounce(() => {
    this.save();
  }, 10);

  private async updateEntity() {
    const entity = this.createEntity(this._ast, this._dependencies.clone().register(new EntityDocumentDependency(this)));
    if (this._entity && this._entity.constructor === entity.constructor) {
      await entity.load();
      patchTreeNode(this._entity, entity);

      // changes made - clean up anything that might case leakage
      entity.dispose();
    } else {
      const oldEntity = this._entity;

      if (oldEntity) {
        this._entity.unobserve(this._entityObserver);
        oldEntity.dispose();
      }

      this._entity    = entity;

      // must load after since the document entities may reference
      // back to this document for the root entity
      await entity.load();
      this._entity.observe(this._entityObserver);
      this.notify(new PropertyChangeAction("entity", entity, oldEntity));
    }
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