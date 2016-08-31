import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { watchProperty } from "sf-core/observable";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { bindable, mixin, virtual } from "sf-core/decorators";
import { diffArray } from "sf-core/utils/array";
import { IDisposable, ITyped, IValued } from "sf-core/object";
import { IInjectable, Injector, DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import {
  Node as MarkupNode,
  ContainerNode,
} from "sf-core/markup";

import {
  IValueNodeEntity,
  IContainerNodeEntity,
  IEntityDocument,
  EntityMetadata,
  IEntity,
  INodeEntity
} from "./base";

export * from "./base";
export * from "./display";
export * from "./utils";


export abstract class BaseNodeEntity<T extends ITyped> extends MarkupNode implements INodeEntity {

  readonly parent: IContainerNodeEntity;
  readonly document: IEntityDocument;
  public metadata: EntityMetadata;

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

  constructor(protected _source: T) {
    super(_source.type);
    this.initialize();
  }

  get source(): T {
    return this._source;
  }

  public flatten(): Array<IEntity> {
    return [this];
  }

  public load() { }
  public update() { }
  public dispose() { }
  public clone() {
    let clone = this._clone();
    if (this._dependencies) {
      clone = Injector.inject(clone, this._dependencies);
    }
    return clone;
  }

  public patch(entity: BaseNodeEntity<T>) {
    this._source       = entity._source;
    this._dependencies = entity._dependencies;
  }

  protected initialize() {
    this.metadata = new EntityMetadata(this, this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
  }

  protected getInitialMetadata() {
    return {};
  }

  protected abstract _clone();
}

export abstract class BaseValueNodeEntity<T extends ITyped & IValued> extends BaseNodeEntity<T> implements IValueNodeEntity {

  @bindable()
  public value: any;
  private _shouldUpdate: boolean;

  constructor(source: T) {
    super(source);
    this.value = source.value;
    watchProperty(this, "value", this.onValueChange.bind(this));
  }

  public update() { }

  public patch(entity: BaseNodeEntity<T>) {
    super.patch(entity);
    this.value  = this.source.value;
  }

  public abstract clone();

  protected onValueChange(newValue: any, oldValue: any) { }

}

@mixin(BaseNodeEntity)
export abstract class BaseContainerNodeEntity<T extends ITyped> extends ContainerNode implements IContainerNodeEntity {

  readonly parent: IContainerNodeEntity;
  readonly metadata: EntityMetadata;
  readonly children: Array<INodeEntity>;

  protected _dependencies: Dependencies;
  private _document: IEntityDocument;

  constructor(protected _source: T) {
    super(_source.type);
    this.initialize();
  }


  async load() {
    for (const childExpression of await this.mapSourceChildNodes()) {
      const entity = EntityFactoryDependency.createEntityFromSource(childExpression, this._dependencies);
      this.appendChild(entity);
      await entity.load();
    }
  }

  patch(entity: BaseContainerNodeEntity<T>) {
    BaseNodeEntity.prototype.patch.call(this, entity);
    const changes = diffArray(this.children, entity.children, (a, b) => a.constructor === b.constructor && a.name === b.name);
    for (const entity of changes.remove) {
      this.removeChild(entity);
    }
    for (const [currentChild, patchChild] of changes.update) {
      currentChild.patch(patchChild);
      const patchIndex   = entity.children.indexOf(patchChild);
      const currentIndex = this.children.indexOf(currentChild);
      if (currentIndex !== patchIndex) {
        const beforeChild = this.children[patchIndex];
        if (beforeChild) {
          this.insertBefore(currentChild, beforeChild);
        } else {
          this.appendChild(currentChild);
        }
      }
    }

    for (const addition of changes.add) {
      const beforeChild = this.children[addition.index];
      if (beforeChild) {
        this.insertBefore(addition.value, beforeChild);
      } else {
        this.appendChild(addition.value);
      }
    }
  }

  @virtual dispose() { }

  get source(): T {
    return this._source;
  }

  get document(): IEntityDocument {
    return this._document;
  }

  set document(value: IEntityDocument) {
    this._document = value;
    for (const child of this.children) {
      child.document = value;
    }
  }

  update() {
    for (const child of this.children) {
      (<IEntity>child).update();
    }
  }

  flatten(): Array<IEntity> {
    const items: Array<IEntity> = [this];
    for (const child of this.children) {
      items.push(...child.flatten());
    }
    return items;
  }

  @virtual protected initialize() { }
  @virtual protected getInitialMetadata() { }
  protected abstract mapSourceChildNodes();
}
