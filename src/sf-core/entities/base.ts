import { IFile } from "sf-core/active-records";
import { Metadata } from "sf-core/metadata";
import { IEntityDisplay } from "./display";
import { IDisposable, INamed } from "../object";
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

export interface IEntitySource extends INamed {

}

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
}

export interface IVisibleEntity extends IEntity {
  readonly display: IEntityDisplay;
  readonly displayType: string;
}

export interface IContainerEntitySource {
  appendChild(source: any);
  removeChild(source: any);
  childNodes: Array<any>;
}

export interface IContainerEntity extends IEntity, IContainerNode {
  readonly source: IContainerEntitySource;
}

export interface IElementEntity extends IContainerEntity {
}
