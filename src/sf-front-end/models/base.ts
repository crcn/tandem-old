import { File } from "sf-common/models";
import { inject } from "sf-common/decorators";
import { IActor } from "sf-common/actors";
import { IEntity } from "sf-common/ast/entities";
import { BubbleBus } from "sf-common/busses";
import { Workspace } from "./workspace";
import { IObservable } from "sf-common/observable";
import { IDisposable } from "sf-common/object";
import { IExpression } from "sf-common/ast";
import { patchTreeNode } from "sf-common/tree";
import { IEntityDocument } from "sf-common/ast";
import { IPoint, Transform } from "sf-common/geom";
import { Action, PropertyChangeAction } from "sf-common/actions";
import { IInjectable, DEPENDENCIES_NS, DependenciesDependency, Dependencies, EntityDocumentDependency } from "sf-common/dependencies";

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
    const ast = !this._entity || this._entity.source.toString() !== this.content ? this.parse(this.content) : this._entity.source;

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
      this._entity.observe(new BubbleBus(this));
      this.notify(new PropertyChangeAction("entity", entity, oldEntity));
    }
  }

  abstract parse(content: string): IExpression;
  protected abstract createEntity(ast: IExpression, dependencies: Dependencies): T;

  async update() {

    // persist change changed from the entity to the source
    this._entity.updateSource();
    this.content = this._entity.source.toString();
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