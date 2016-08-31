import { IFile } from "sf-core/active-records";
import { Metadata } from "sf-core/metadata";
import { BubbleBus } from "sf-core/busses";
import { IExpression } from "sf-core/ast";
import { bindable } from "sf-core/decorators";
import { IInjectable } from "sf-core/dependencies";
import { watchProperty } from "sf-core/observable";
import { IEntityDisplay } from "./display";
import { IDisposable, IOwnable, INamed, IValued } from "sf-core/object";
import {
  INode,
  Element,
  IElement,
  IValueNode,
  ContainerNode,
  IContainerNode,
  Node as MarkupNode,
} from "sf-core/markup";

export class EntityMetadata extends Metadata implements IOwnable {
  constructor(readonly owner: IEntity, data?: any) {
    super(data);
  }
}

export interface IEntityDocument {
  update();
  parse(source: string): IExpression;
}

export interface IEntity extends IDisposable, IInjectable {
  document: IEntityDocument;
  readonly parent: IEntity;
  readonly metadata: EntityMetadata;
  readonly source: any;

  /**
   * update source from props on this entity
   */

  update();

  /**
   * loads the entity from the source
   */

  load();

  /**
   * patche this entity from another one.
   */

  patch(entity: IEntity): void;

  /**
   */

  flatten(): Array<IEntity>;
}

export interface IValueEntity extends IEntity {
  value: any;
}

export interface IContextualEntity extends IEntity {
  context: any;
}

export interface IContainerNodeEntitySource {
  appendChild(source: any);
  removeChild(source: any);
  children: Array<any>;
}

export interface INodeEntity extends INode, IEntity {
  parent: IContainerNodeEntity;
  flatten(): Array<IEntity>;
}
export interface IContainerNodeEntity extends IContainerNode, INodeEntity {
  parent: IContainerNodeEntity;
  children: Array<INodeEntity>;
}

export interface IValueNodeEntity extends INodeEntity, IValueNode {
  parent: IContainerNodeEntity;
}

export interface IElementEntity extends IElement, IContainerNodeEntity {
  parent: IContainerNodeEntity;
  children: Array<INodeEntity>;
}
export interface IVisibleNodeEntity extends INodeEntity {
  display: IEntityDisplay;
}

export abstract class BaseNodeEntity<T extends INamed> extends MarkupNode implements INodeEntity {

  readonly parent: IContainerNodeEntity;
  readonly document: IEntityDocument;
  readonly metadata: EntityMetadata;

  constructor(protected _source: T) {
    super(_source.name);
    this.metadata = new EntityMetadata(this);
    this.metadata.observe(new BubbleBus(this));
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

  public abstract clone();
  public abstract patch(entity: BaseNodeEntity<T>);
}

export abstract class BaseValueNodeEntity<T extends INamed & IValued> extends BaseNodeEntity<T> implements IValueNodeEntity {

  @bindable()
  public value: any;

  constructor(source: T) {
    super(source);
    this.initialize();
    this.value = source.value;
    watchProperty(this, "value", this.onValueChange.bind(this)).trigger();
  }

  public update() {
    this.source.value = this.value;
  }

  protected initialize() { }
  protected onValueChange(newValue: any, oldValue: any)  {
  }

  patch(entity: BaseNodeEntity<T>) {
    this._source = entity.source;
    this.value  = this._source.value;
  }

  abstract clone();
}