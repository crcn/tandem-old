import { inject } from "tandem-common/decorators";
import { BubbleBus } from "tandem-common/busses";
import { watchProperty } from "tandem-common/observable";
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

  @inject(DEPENDENCIES_NS)
  @patchable
  protected _dependencies: Dependencies;

  @inject(ENTITY_DOCUMENT_NS)
  @patchable
  readonly document: IEntityDocument;

  @patchable
  protected _source: T;

  constructor(_source: T) {
    super();
    this._source = _source;
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

  public load(): any {
    const load = async () => {
      await this.loadLeaf();
      for (const childExpression of await this.mapSourceChildren()) {
        await this.loadExpressionAndAppendChild(childExpression);
      }
      this.updateFromLoaded();
    };

    return load();
  }

  public async loadExpressionAndAppendChild(childExpression: IExpression) {
    const factory = EntityFactoryDependency.findBySource(childExpression, this._dependencies);
    if (!factory) {
      return console.warn(`Unable to find entity factory expression ${childExpression.constructor.name}`);
    }
    const entity = factory.create(childExpression);
    this.appendChild(entity);
    await entity.load();
    return entity;
  }

  loadLeaf() { }

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
  @patchable
  public value: any;

  private _shouldUpdate: boolean;

  constructor(source: T) {
    super(source);
    this.value = source.value;
    watchProperty(this, "value", this.onValueChange.bind(this));
  }

  mapSourceChildren() {
    return [];
  }

  protected onValueChange(newValue: any, oldValue: any) { }
}
