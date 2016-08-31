import { IFile } from "sf-core/active-records";
import { Metadata } from "sf-core/metadata";
import { IExpression } from "sf-core/ast";
import { IInjectable } from "sf-core/dependencies";
import { IEntityDisplay } from "./display";
import { IDisposable, IOwnable, INamed } from "sf-core/object";
import {
  INode,
  IValueNode,
  IElement,
  Element,
  ContainerNode,
  IContainerNode,
} from "sf-core/markup";

export class EntityMetadata extends Metadata implements IOwnable {
  constructor(readonly owner: IEntity, data?: any) {
    super(data);
  }
}

export interface IEntityDocument {
  update();
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
  root: IContainerNodeEntity;
  flatten(): Array<IEntity>;
}
export interface IContainerNodeEntity extends IContainerNode, INodeEntity {
  parent: IContainerNodeEntity;
  root: IContainerNodeEntity;
  children: Array<INodeEntity>;
}

export interface IValueNodeEntity extends INodeEntity, IValueNode {
  parent: IContainerNodeEntity;
  root: IContainerNodeEntity;
}

export interface IElementEntity extends IElement, IContainerNodeEntity {
  parent: IContainerNodeEntity;
  root: IContainerNodeEntity;
  children: Array<INodeEntity>;
}
export interface IVisibleNodeEntity extends INodeEntity {
  display: IEntityDisplay;
}

export function getContext(entity: IEntity) {
  let p = <IContextualEntity>entity.parent;
  while (p && !p.context) p = <IContextualEntity>p.parent;
  return p ? p.context || {} : {};
}