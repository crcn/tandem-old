import { IFile } from "sf-core/active-records";
import { Metadata } from "sf-core/metadata";
import { BubbleBus } from "sf-core/busses";
import { IExpression } from "sf-core/ast";
import { IInjectable } from "sf-core/dependencies";
import { watchProperty } from "sf-core/observable";
import { IEntityDisplay } from "./display";
import { bindable, mixin, virtual } from "sf-core/decorators";
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
  public metadata: EntityMetadata;

  constructor(public source: T) {
    super(source.name);
    this.initialize();
  }

  public flatten(): Array<IEntity> {
    return [this];
  }

  public load() { }
  public update() { }
  public dispose() { }

  public abstract clone();
  public abstract patch(entity: BaseNodeEntity<T>);

  protected initialize() {
    this.metadata = new EntityMetadata(this, this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
  }

  protected getInitialMetadata() {
    return {};
  }
}

export abstract class BaseValueNodeEntity<T extends INamed & IValued> extends BaseNodeEntity<T> implements IValueNodeEntity {

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
    this.source = entity.source;
    this.value  = this.source.value;
  }

  public abstract clone();

  protected onValueChange(newValue: any, oldValue: any) { }

}

@mixin(BaseNodeEntity)
export abstract class BaseContainerNodeEntity<T extends INamed> extends ContainerNode implements IContainerNodeEntity {

  readonly parent: IContainerNodeEntity;
  readonly metadata: EntityMetadata;
  readonly children: Array<INodeEntity>;

  private _document: IEntityDocument;

  constructor(protected _source: T) {
    super(_source.name);
    this.initialize();
  }

  @virtual load() { }
  @virtual patch(source: BaseContainerNodeEntity<T>) { }
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
}
