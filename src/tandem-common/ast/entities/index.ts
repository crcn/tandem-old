import { IActor } from "tandem-common/actors";
import { inject } from "tandem-common/decorators";
import { WrapBus } from "mesh";
import { BubbleBus } from "tandem-common/busses";
import { diffArray } from "tandem-common/utils/array";
import { watchProperty } from "tandem-common/observable";
import { Action, TreeNodeAction } from "tandem-common/actions";
import { IDisposable, ITyped, IValued } from "tandem-common/object";
import { bindable, mixin, virtual, patchable } from "tandem-common/decorators";
import { IInjectable, Injector, DEPENDENCIES_NS, Dependencies } from "tandem-common/dependencies";
import { EntityFactoryDependency, EntityDocumentDependency, ENTITY_DOCUMENT_NS } from "tandem-common/dependencies";

import { TreeNode } from "tandem-common/tree";
import { IExpression } from "tandem-common/ast";

import {
  IEntityDocument,
  EntityMetadata,
  IValueEntity,
  IEntity
} from "./base";

export * from "./base";
export * from "./display";
export * from "./utils";

export abstract class BaseEntity<T extends IExpression> extends TreeNode<BaseEntity<any>> implements IEntity {

  public metadata: EntityMetadata;


  @patchable
  protected _source: T;

  private _context: any;

  constructor(_source: T) {
    super();
    this._source = _source;
    this.initialize();
  }

  get document(): IEntityDocument {
    return this.context.document;
  }

  get source(): T {
    return this._source;
  }

  public dispose() {
    for (const child of this.children) {
      child.dispose();
    }
  }

  get context(): any {
    return this._context;
  }

  set context(value: any) {
    this._context = Object.assign({}, value);
  }

  protected get dependencies(): Dependencies {
    return this.context.dependencies;
  }

  public flatten(): Array<IEntity> {
    const items: Array<IEntity> = [this];
    for (const child of this.children) {
      items.push(...child.flatten());
    }
    return items;
  }

  public compare(entity: IEntity): number {
    return Number(entity.constructor === this.constructor);
  }

  public async load() {
    await this.loadLeaf();
    for (const childExpression of this.mapSourceChildren()) {
      await this.loadExpressionAndAppendChild(childExpression);
    }
    this.updateFromLoaded();
  }

  public async update() {
    let currentContext = this.context;
    const mappedSourceChildren = this.mapSourceChildren();
    for (let i = 0, n = mappedSourceChildren.length; i < n; i++) {
      const childSource = mappedSourceChildren[i];
      let childEntity   = this.children[i];
      const childEntityFactory = EntityFactoryDependency.findBySource(childSource, currentContext.dependencies);
      if (!childEntity || childEntity.source !== childSource || childEntity.constructor !== childEntityFactory.entityClass) {

        if (childEntity) {
          this.removeChild(childEntity);
          childEntity.dispose();
        }

        childEntity = childEntityFactory.create(childSource);
        childEntity.context = currentContext;
        this.insertAt(childEntity, i);
        await childEntity.load();
      } else {
        childEntity.context = currentContext;
        await childEntity.update();
      }

      currentContext = childEntity.context;
    }

    while (this.children.length !== mappedSourceChildren.length) {
      const child = this.lastChild;
      this.removeChild(child);
      child.dispose();
    }

    this.updateFromSource();
    this.updateFromLoaded();
  }

  protected get currentContext() {
    return this.lastChild ? this.lastChild.context : this._context;
  }

  public async loadExpressionAndInsertChildAt(childExpression: IExpression, index: number) {
    const factory = EntityFactoryDependency.findBySource(childExpression, this.currentContext.dependencies);
    if (!factory) {
      throw new Error(`Unable to find entity factory expression ${childExpression.constructor.name}`);
    }
    const entity = factory.create(childExpression);
    entity.context = this.currentContext;
    this.insertAt(entity, index);
    await entity.load();
    return entity;
  }

  public loadExpressionAndAppendChild(childExpression: IExpression) {
    return this.loadExpressionAndInsertChildAt(childExpression, this.children.length);
  }

  loadLeaf() { }

  public clone() {
    let clone = super.clone();
    clone.metadata.copyFrom(this.metadata);
    clone.updateFromLoaded();
    return clone;
  }

  public patch(entity: BaseEntity<T>) {
  }

  protected updateFromLoaded() { }

  protected initialize() {
    this.updateFromSource();
    this.metadata = new EntityMetadata(this, this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
  }

  protected updateFromSource() { }

  protected getInitialMetadata() {

    // TODO - possibly search for metadata from dependencies
    return {};
  }

  protected mapSourceChildren(): Array<IExpression> {
    return <Array<IExpression>>this.source.children;
  }

  protected abstract cloneLeaf();
}

export abstract class BaseValueEntity<T extends IExpression & IValued> extends BaseEntity<T> implements IValueEntity {

  @bindable()
  @patchable
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
