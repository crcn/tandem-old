
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

  public get entity(): T {
    return this._entity;
  }

  onContentChange(newContent: string) {
    if (this._entity) {
      this.load();
    }
  }

  public async load() {

    // do not parse the content if it's the same as the previously parsed ast.
    // This is necessary since parts of the application hold references to entity sources when they're
    // modified. The only case where the ast should be re-parsed is when new content is coming in externally. In that case, the
    // entire ast needs to be replaced.

    // TODO - listen to source when it changes, then update the document
    const ast = !this._entity || this._entity.source.toString() !== this.content ? await this.parse(this.content) : this._entity.source;
    ast.source = this;

    const entity = this.createEntity(ast, this._dependencies.clone().register(new EntityDocumentDependency(this)));
    if (this._entity && this._entity.constructor === entity.constructor) {
      await entity.load();
      patchTreeNode(this._entity, entity);
    } else {
      const oldEntity = this._entity;
      this._entity    = entity;

      // must load after since the document entities may reference
      // back to this document for the root entity
      await entity.load();
      this._entity.observe(new WrapBus(this.onEntityAction.bind(this)));
      this.notify(new PropertyChangeAction("entity", entity, oldEntity));
    }
  }

  abstract async parse(content: string): Promise<IExpression>;
  protected abstract createEntity(ast: IExpression, dependencies: Dependencies): T;

  async update() {

    // persist change changed from the entity to the source
    this._entity.updateSource();
    this.content = this._entity.source.toString();
    await super.update();
    await this.load();
  }

  protected onEntityAction(action: Action) {
    if (action.type === EntityAction.ENTITY_UPDATE) {
      console.log("updating source");
      this._updateDebounce();
    }
    this.notify(action);
  }

  private _updateDebounce = debounce(() => {
    this.update();
  }, 500);
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