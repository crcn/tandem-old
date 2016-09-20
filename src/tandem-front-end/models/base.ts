
import { WrapBus } from "mesh";
import { Workspace } from "./workspace";
import { debounce } from "lodash";
import { DocumentFileAction } from "tandem-front-end/actions";
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
  IASTNode,
  IInjectable,
  EntityAction,
  EntityRuntime,
  Dependencies,
  patchTreeNode,
  watchProperty,
  BaseASTNode,
  IEntityDocument,
  DEPENDENCIES_NS,
  IASTNodeLoader,
  PropertyChangeAction,
  DependenciesDependency,
  EntityFactoryDependency,
  EntityDocumentDependency,
  IFileModelActionResponseData,
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

const REQUEST_SAVE_TIMEOUT = process.env.TESTING ? 1 : 200;

// TODO - need to separate this from runtime
export abstract class DocumentFile<T extends IEntity & IObservable> extends File implements IEntityDocument {

  public offset: number;
  public owner: IEntityDocument;
  public autoSave: boolean;
  public context: any;

  @bindable()
  public entity: T;

  private _ast: IASTNode;
  private _loaded: boolean;
  private _runtime: EntityRuntime;
  private _runtimeObserver: IActor;
  private _formatterObserver: IActor;
  private _expressionLoader: IASTNodeLoader;
  private _ignoreExpressionActions: boolean;

  didInject() {
    this._runtime = new EntityRuntime(this.createEntity.bind(this), this.getRuntimeContext.bind(this));
    this._runtime.observe(this._runtimeObserver = new WrapBus(this.onRuntimeAction.bind(this)));
    this._expressionLoader = this.createExpressionLoader();
    this._expressionLoader.observe(new WrapBus(this.onExpressionLoaderAction.bind(this)));
    bindProperty(this._runtime, "entity", this);
  }

  private getRuntimeContext() {
    return this.context || {
      document: this,
      dependencies: this._dependencies.clone()
    };
  }

  public async load() {
    if (this._loaded) return;
    this._loaded = true;
    const ast = await this._expressionLoader.load(this);
    await this._runtime.load(this._ast = ast);
    this.notify(new DocumentFileAction(DocumentFileAction.LOADED));
  }

  protected abstract createExpressionLoader(): IASTNodeLoader;

  protected abstract createEntity(ast: IASTNode): T;

  protected onExpressionLoaderAction(action: Action) {
    if (this.autoSave !== false) this.deferSave();
  }

  protected onRuntimeAction(action: Action) {
    this.notify(action);
  }

  private deferSave = debounce(() => {
    this.save();
  }, REQUEST_SAVE_TIMEOUT);
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