import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { diffArray } from "sf-core/utils/array";
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

  public async load() {
    for (const childExpression of await this.mapSourceChildren()) {
      const entity = EntityFactoryDependency.createEntityFromSource(childExpression, this._dependencies);
      this.children.push(entity);
      await entity.load();
    }
  }

  public update() {
    for (const child of this.children) {
      child.update();
    }
  }

  public clone() {
    let clone = super.clone();
    if (this._dependencies) {
      clone = Injector.inject(clone, this._dependencies);
    }
    return clone;
  }

  public patch(entity: BaseEntity<T>) {
    this._source       = entity._source;
    this._dependencies = entity._dependencies;
    const changes = diffArray(this.children, entity.children, this.compareChild.bind(this));
    for (const entity of changes.remove) {
      this.children.remove(entity);
    }
    for (const [currentChild, patchChild] of changes.update) {
      currentChild.patch(patchChild);
      const patchIndex   = entity.children.indexOf(patchChild);
      const currentIndex = this.children.indexOf(currentChild);
      if (currentIndex !== patchIndex) {
        const beforeChild = this.children[patchIndex];
        if (beforeChild) {
          this.children.splice(this.children.indexOf(beforeChild), 0, currentChild);
        } else {
          this.children.push(currentChild);
        }
      }
    }

    for (const addition of changes.add) {
      const beforeChild = this.children[addition.index];
      if (beforeChild) {
          this.children.splice(this.children.indexOf(beforeChild), 0, addition.value);
      } else {
        this.children.push(addition.value);
      }
    }

    this.updateFromSource();
  }

  protected initialize() {
    this.updateFromSource();
    this.metadata = new EntityMetadata(this, this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
  }

  protected updateFromSource() { }

  protected getInitialMetadata() {
    return {};
  }

  protected compareChild(a: IEntity, b: IEntity) {
    return a.constructor === b.constructor && a.source.type === b.source.type;
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
