import { IFile } from "sf-core/active-records";
import { Metadata } from "sf-core/metadata";
import { IDisposable } from "../object";
import { IEntityDisplay } from "./display";
import {
  INode,
  Element,
  ValueNode,
  IDiffableNode,
  ContainerNode,
  IContainerNode,
  IDiffableElement,
  IDiffableValueNode,
} from "../markup";

export interface IEntityDocument extends IContainerNode {
  readonly root: IEntity;
  readonly file: IFile;
  sync();
}

export class EntityMetadata extends Metadata {
  constructor(readonly entity: IEntity) {
    super();
  }
}

// TODO - IEntity should not extend INode since it is not limited to the markup lang
// TODO - should extend ITyped interface
export interface IEntity extends INode, IDisposable {

  /**
   * additional information about the entity that is
   * specific to the environment that it's currently in. This
   * may include information such as hover states, dragging states, etc.
   */

  readonly metadata: EntityMetadata;

  // TODO - do not use "any" here.
  source: any;

  /**
   * the type property helps other parts of the application figure out how
   * how this *type* of entity should be handled -- much better than using
   * other methods such as instanceof, or constructor.name
   */

  readonly type: string;

  /**
   * The creator if this entity
   */

  document: IEntityDocument;

  /**
   * update source from props on this entity
   */

  sync();
}

export interface IVisibleEntity extends IEntity {
  readonly display: IEntityDisplay;
  readonly displayType: string;
}

export interface IContainerEntity extends IEntity, IContainerNode {
  appendSourceChildNode(source: any): Promise<IEntity>;
}

export interface IElementEntity extends IContainerEntity {
}
