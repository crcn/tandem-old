import { IActor } from "tandem-common/actors";
import { inject } from "tandem-common/decorators";
import { WrapBus } from "mesh";
import { BubbleBus } from "tandem-common/busses";
import { diffArray } from "tandem-common/utils/array";
import { watchProperty } from "tandem-common/observable";
import { bindable, mixin, virtual, patchable } from "tandem-common/decorators";
import { Action, TreeNodeAction, EntityAction } from "tandem-common/actions";
import { IDisposable, ITyped, IValued, IPatchable } from "tandem-common/object";
import { IInjectable, Injector, DEPENDENCIES_NS, Dependencies } from "tandem-common/dependencies";
import { EntityFactoryDependency, EntityDocumentDependency, ENTITY_DOCUMENT_NS } from "tandem-common/dependencies";

import { IExpression } from "tandem-common/ast";
import { TreeNode, patchTreeNode } from "tandem-common/tree";

import {
  IEntity,
  IValueEntity,
  EntityMetadata,
  IEntityDocument,
} from "./base";

export * from "./base";
export * from "./display";
export * from "./utils";
export * from "./controllers";

export abstract class BaseEntity<T extends IExpression> extends TreeNode<BaseEntity<any>> implements IEntity, IPatchable {

  public metadata: EntityMetadata;

  @patchable
  protected _source: T;

  public context: any;

  /**
   * TRUE if the source expression has changed and the entity has not evaluated
   * yet
   */

  protected _dirty: boolean;

  /**
   * true if the entity has has evaluated for the first time
   */

  private _loaded: boolean;

  /**
   * Observer for any changes on the source expression
   */
  private _sourceObserver: IActor;

  /**
   * All Child entities of thie entity -- used for flatten() caching
   */

  private _allChildEntities: Array<IEntity>;


  constructor(_source: T) {
    super();
    this._source = _source;

    // TODO - deprecate this
    this.initialize();
  }

  get document(): IEntityDocument {
    return <IEntityDocument><any>this._source.source;
  }

  get source(): T {
    return this._source;
  }

  public dispose() {
    this._source.unobserve(this._sourceObserver);
    for (const child of this.children) {
      child.dispose();
    }
  }

  protected get dependencies(): Dependencies {
    return this.context.dependencies;
  }

  protected getChildContext() {
    return this.context;
  }

  public patch(entity: BaseEntity<any>) { }

  public flatten(): Array<IEntity> {

    // caching gets busted here when children are added or removed
    if (this._allChildEntities) return this._allChildEntities;
    const items: Array<IEntity> = [this];
    for (const child of this.children) {
      items.push(...child.flatten());
    }

    return this._allChildEntities = items;
  }

  public compare(entity: IEntity): number {
    return Number(entity.constructor === this.constructor);
  }

  public async evaluate(context: any) {
    this.context = context;

    if (this._loaded) {
      await this.update();
      this._dirty = false;
    } else {
      this._loaded = true;
      await this.load();
    }
  }

  // TODO - make this abstract
  protected async load() {
  }

  protected async reload() {
    const clone = this.cloneLeaf();
    await clone.evaluate(this.context);
    patchTreeNode(this, clone);
    clone.dispose();
  }

  // TODO - make this abstract
  protected async update() {
    await this.reloadIfDirty();
  }

  protected async reloadIfDirty() {
    if (this._dirty) {
      await this.reload();
    }
  }

  protected shouldDispose() {
    return false;
  }

  public async loadExpressionAndInsertChildAt(childExpression: IExpression, index: number) {
    const factory = EntityFactoryDependency.findBySource(childExpression, this.context.dependencies);
    if (!factory) {
      throw new Error(`Unable to find entity factory expression ${childExpression.constructor.name}`);
    }
    const entity = factory.create(childExpression);
    this.context = await entity.evaluate(this.getChildContext());
    this.insertChildAt(entity, index);
    return entity;
  }

  public loadExpressionAndAppendChild(childExpression: IExpression) {
    return this.loadExpressionAndInsertChildAt(childExpression, this.children.length);
  }

  public clone() {
    let clone = super.clone();
    clone.metadata.copyFrom(this.metadata);
    clone.context = this.context;
    clone._dirty =  this._dirty;
    return clone;
  }

  protected initialize() {
    this._source.observe(this._sourceObserver = new WrapBus(this.onSourceAction.bind(this)));
    this.metadata = new EntityMetadata(this, this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
  }

  protected getInitialMetadata() {

    // TODO - possibly search for metadata from dependencies
    return {};
  }

  protected onSourceAction(action: Action) {
    this._dirty = true;
    this.notify(new EntityAction(EntityAction.ENTITY_DIRTY));
  }

  protected onChildAction(action: Action) {

    // child entity is dirty from a source expression change -- this entity is dirty. Note
    // that child entities may contain sources from different documents, hence why there
    // are two places where this entity can be flagged as dirty.
    if (action.type === EntityAction.ENTITY_DIRTY) {
      if (this._dirty) return;
      this._dirty = true;
    }

    // child entity added or removed -- bust the allChildEntities cache
    if (action.type === TreeNodeAction.NODE_ADDED || action.type === TreeNodeAction.NODE_REMOVED) {
      this._allChildEntities = undefined;
    }

    super.onChildAction(action);
  }

  protected mapSourceChildren(): Array<IExpression> {
    return <Array<IExpression>>this.source.children;
  }

  protected abstract cloneLeaf();
}

export abstract class BaseValueEntity<T extends IExpression & IValued> extends BaseEntity<T> implements IValueEntity {

  @bindable()
  public value: any;

  private _shouldUpdate: boolean;

  constructor(source: T) {
    super(source);
    watchProperty(this.source, "value", this.onSourceValueChange.bind(this)).trigger();
  }

  mapSourceChildren() {
    return [];
  }

  protected onSourceValueChange(newValue: any, oldValue: any) {
    this.value = newValue;
  }
}

// TODO
export class EntityChildSourceSynchronizer {
  constructor(readonly entity: IEntity, readonly mapSourceChildren: Function) {

  }
  async load() { }
}