import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { watchProperty } from "sf-core/observable";
import { bindable, mixin, virtual } from "sf-core/decorators";
import { IDisposable, ITyped, IValued } from "sf-core/object";
import { IInjectable, Injector, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { EntityFactoryDependency, EntityDocumentDependency, ENTITY_DOCUMENT_NS } from "sf-core/dependencies";

import { TreeNode } from "sf-core/tree";
import { IExpression } from "sf-core/ast";

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

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

  @inject(ENTITY_DOCUMENT_NS)
  readonly document: IEntityDocument;

  constructor(protected _source: T) {
    super();
    this.initialize();
  }

  get source(): T {
    return this._source;
  }

  public dispose() {
    for (const child of this.children) {
      child.dispose();
    }
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
    for (const childExpression of await this.mapSourceChildren()) {
      await this.loadExpressionAndAppendChild(childExpression);
    }
    this.updateFromLoaded();
  }

  protected async loadExpressionAndAppendChild(childExpression: IExpression) {
    const entity = EntityFactoryDependency.createEntityFromSource(childExpression, this._dependencies);
    this.appendChild(entity);
    await entity.load();
  }

  loadLeaf() {

  }

  public updateSource() {
    for (const child of this.children) {
      child.updateSource();
    }
  }

  public clone() {
    let clone = super.clone();
    if (this._dependencies) {
      clone = Injector.inject(clone, this._dependencies);
    }
    clone.metadata.copyFrom(this.metadata);
    clone.updateFromLoaded();
    return clone;
  }

  public patch(entity: BaseEntity<T>) {
    this._source       = entity._source;
    this._dependencies = entity._dependencies;
    this.updateFromSource();
    this.updateFromLoaded();
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
  public value: any;
  private _shouldUpdate: boolean;

  constructor(source: T) {
    super(source);
    this.value = source.value;
    watchProperty(this, "value", this.onValueChange.bind(this));
  }

  public patch(entity: BaseValueEntity<T>) {
    super.patch(entity);
    this.value  = this.source.value;
  }

  mapSourceChildren() {
    return [];
  }

  protected onValueChange(newValue: any, oldValue: any) { }
}
