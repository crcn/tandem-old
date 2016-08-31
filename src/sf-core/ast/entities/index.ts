import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { diffArray } from "sf-core/utils/array";
import { watchProperty } from "sf-core/observable";
import { bindable, mixin, virtual } from "sf-core/decorators";
import { IDisposable, ITyped, IValued } from "sf-core/object";
import { EntityFactoryDependency, EntityDocumentDependency, ENTITY_DOCUMENT_NS } from "sf-core/dependencies";
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
  public metadata: EntityMetadata;

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

  @inject(ENTITY_DOCUMENT_NS)
  readonly document: IEntityDocument;

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

  remove() {
    this.removeSourceFromParent();
    this.dispose();
  }

  protected removeSourceFromParent() {
    const parent = this.parent;
    if (!this.parent || !this.parent.source.children) return;
    const index = this.parent.source.children.indexOf(this.source);
    if (index !== -1) {
      this.parent.source.children.splice(index, 1);
    }
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
  readonly document: IEntityDocument;

  protected _dependencies: Dependencies;

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
    const changes = diffArray(this.children, entity.children, this.compareChild.bind(this));
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

  get source(): T {
    return this._source;
  }

  protected compareChild(a: INodeEntity, b: INodeEntity) {
    return a.constructor === b.constructor && a.name === b.name;
  }

  update() {
    for (const child of this.children) {
      (<IEntity>child).update();
    }
  }

  dispose() {
    BaseNodeEntity.prototype.dispose.call(this);
    for (const child of this.children) {
      child.dispose();
    }
  }

  flatten(): Array<IEntity> {
    const items: Array<IEntity> = [this];
    for (const child of this.children) {
      items.push(...child.flatten());
    }
    return items;
  }

  @virtual remove() { }
  @virtual protected initialize() { }
  @virtual protected getInitialMetadata() { }
  @virtual protected updateFromSource() { }
  protected abstract mapSourceChildNodes();
}
