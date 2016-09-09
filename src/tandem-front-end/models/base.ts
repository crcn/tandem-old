
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
  IASTStringFormatter,
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
  private _sourceContent: string;
  private _runtimeObserver: IActor;
  private _runtime: EntityRuntime;
  private _formatter: IASTStringFormatter;

  didInject() {
    this._runtime = new EntityRuntime({ document: this }, this._dependencies.clone(), this.createEntity.bind(this));
    this._runtime.observe(this._runtimeObserver = new WrapBus(this.onRuntimeAction.bind(this)));
    bindProperty(this._runtime, "entity", this);

    this._formatter = this.createASTFormatter();
    watchProperty(this._formatter, "content", this.onFormattedContent.bind(this));
  }

  onContentChange(newContent: string) {
    if (this._formatter.content !== newContent) {
      this.load();
    }
  }

  public async load() {
    const ast = await this.parse(this._sourceContent = this.content);
    ast.source = this;

    this._formatter.expression = undefined;

    if (this._ast) {
      patchTreeNode(this._ast, ast);
    } else {
      await this._runtime.load(this._ast = ast);
    }

    this._formatter.expression = this._ast;

    this.notify(new DocumentFileAction(DocumentFileAction.LOADED));
  }

  abstract async parse(content: string): Promise<IExpression>;
  protected abstract createEntity(ast: IExpression): T;
  abstract protected createASTFormatter(): IASTStringFormatter {
    // OVERRIDE ME
    return null;
  }

  protected onRuntimeAction(action: Action) {
    this.notify(action);
  }

  protected onFormattedContent(content: string) {
    this.content = content;
    this.requestSave();
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