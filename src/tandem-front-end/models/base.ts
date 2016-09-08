
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
    const newAst = await this.parse(this._sourceContent = this.content);

    if (this._ast) {

      // remove the expression observer for now so that the patching
      // does not trigger a save() below
      this._ast.unobserve(this._expressionObserver);

      // apply the changes to the current AST -- this will notify any entities
      // that also need to change
      patchTreeNode(this._ast, newAst);

      this._ast.observe(this._expressionObserver);

      // since the entity tree is dirty at this point, we'll need to apply an update
      await this._entity.update();
    } else {
      this._ast = newAst;
      this._ast.source = this;
      this._ast.observe(this._expressionObserver);

      const entity = this._entity = this.createEntity(this._ast);

      entity.context = {
        document: this,
        dependencies: new Dependencies(EntityFactoryDependency.findAll(this._dependencies))
      };

      console.log(entity.context);

      await entity.load();

      // listen for any changes so that the rest of the application may reflect
      // changes onthe entity tree
      this._entity.observe(this._entityObserver);

      this.notify(new PropertyChangeAction("entity", entity, undefined));
    }
  }

  abstract async parse(content: string): Promise<IExpression>;
  protected abstract createEntity(ast: IExpression): T;

  async save() {
    this.content = this._sourceContent = this._entity.source.toString();

    await this._entity.update();
    return super.save();
  }

  protected onExpressionAction(action: Action) {
    this.requestSave();
    this.notify(action);
  }

  protected onEntityAction(action: Action) {
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