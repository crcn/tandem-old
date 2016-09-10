
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
  IExpression,
  IInjectable,
  EntityAction,
  EntityRuntime,
  Dependencies,
  patchTreeNode,
  watchProperty,
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

const REQUEST_SAVE_TIMEOUT = process.env.TESTING ? 1 : 200;

// TODO - need to separate this from runtime
export abstract class DocumentFile<T extends IEntity & IObservable> extends File implements IEntityDocument {

  public owner: IEntityDocument;

  @bindable()
  public entity: T;

  private _ast: IExpression;
  private _runtime: EntityRuntime;
  private _runtimeObserver: IActor;

  didInject() {

    this._runtime = new EntityRuntime(this.createEntity.bind(this), this.createContext());

    this._runtime.observe(this._runtimeObserver = new WrapBus(this.onRuntimeAction.bind(this)));
    bindProperty(this._runtime, "entity", this);
  }

  onUpdated() {
    super.onUpdated();
    this.load();
  }

  protected createContext() {
    return {
      document: this,
      dependencies: this._dependencies.clone()
    };
  }

  public async load() {
    const ast = await this.parse(this.content);
    ast.source = this;

    if (this._ast) {
      if (ast.formatter) {
        ast.formatter.dispose();
      }
      patchTreeNode(this._ast, ast);
    } else {
      ast.observe(new WrapBus(this.requestSave));
      await this._runtime.load(this._ast = ast);
    }

    this.notify(new DocumentFileAction(DocumentFileAction.LOADED));
  }

  abstract async parse(content: string): Promise<IExpression>;
  protected abstract createEntity(ast: IExpression): T;

  protected onRuntimeAction(action: Action) {
    this.notify(action);
  }

  private requestSave = debounce(() => {
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