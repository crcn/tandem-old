import { IEntityDisplay } from "./display";
import { IDisposable } from "../object";
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


// export interface IEntityDisplayMutator extends IEntityMutator {
//   appendChild(child: IEntity);
//   removeChild(child: IEntity);
// }


export interface IEntityDocument extends IContainerNode {
  readonly root: IEntity;
  sync();
}

// TODO - IEntity should not extend INode since it is not limited to the markup lang
// TODO - should extend ITyped interface
export interface IEntity extends INode, IDisposable {

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
}

export interface IContainerEntity extends IEntity, IContainerNode {
  appendSourceChildNode(source: any): Promise<IEntity>;
}

export interface IElementEntity extends IContainerEntity {
}
