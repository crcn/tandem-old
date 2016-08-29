import { IFile } from "sf-core/active-records";
import { Metadata } from "sf-core/metadata";
import { IExpression } from "sf-core/ast";
import { IInjectable } from "sf-core/dependencies";
import { IEntityDisplay } from "./display";
import { IDisposable, INamed } from "sf-core/object";
import {
  INode,
  IValueNode,
  IElement,
  Element,
  ContainerNode,
  IContainerNode,
} from "sf-core/markup";

export interface IEntityDocument extends IContainerNode {
  readonly root: IEntity;

  // TODO - possibly change file to source since it's a bit more generic
  readonly file: IFile;
  update();
}

export class EntityMetadata extends Metadata {
  constructor(readonly entity: IEntity, data?: any) {
    super(data);
  }
}

export interface IEntity extends IDisposable, IInjectable {
  readonly parent: IEntity;
  readonly metadata: EntityMetadata;
  readonly source: any;
  readonly document: IEntityDocument;

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

  patch(entity: IEntity);

  /**
   */

  find(filter: (entity: IEntity) => boolean): IEntity;

  /**
   */

  flatten(): Array<IEntity>;
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
  source: IContainerNodeEntitySource;
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
