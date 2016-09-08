
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
  bindable,
  BubbleBus,
  Transform,
  IDisposable,
  IObservable,
  bindProperty,
  IExpression,
  IInjectable,
  EntityAction,
  EntityRuntime,
  Dependencies,
  patchTreeNode,
  BaseExpression,
  IEntityDocument,
  DEPENDENCIES_NS,
  PropertyChangeAction,
  DependenciesDependency,
  EntityFactoryDependency,
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

// TODO - need to separate this from runtime
export abstract class DocumentFile<T extends IEntity & IObservable> extends File implements IEntityDocument {

  public owner: IEntityDocument;

  @bindable()
  public entity: T;

  private _ast: IExpression;
  private _sourceContent: string;
  private _runtimeObserver: IActor;
  private _runtime: EntityRuntime;

  didInject() {
    this._runtime = new EntityRuntime({ document: this }, this._dependencies.clone(), this.createEntity.bind(this));
    this._runtime.observe(this._runtimeObserver = new WrapBus(this.onRuntimeAction.bind(this)));
    bindProperty(this._runtime, "entity", this);
  }

  onContentChange(newContent: string) {
    if (this._sourceContent !== newContent) {
      this.load();
    }
  }

  public async load() {
    const ast = await this.parse(this._sourceContent = this.content);
    ast.source = this;
    await this._runtime.load(ast);
  }

  abstract async parse(content: string): Promise<IExpression>;
  protected abstract createEntity(ast: IExpression): T;

  async save() {
    this.content = this._sourceContent = this.entity.source.toString();
    return super.save();
  }

  protected onRuntimeAction(action: Action) {
    if (action.target instanceof BaseExpression) {
      this.requestSave();
    }
    this.notify(action);
  }

  private requestSave = debounce(() => {
    this.save();
  }, 10);
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