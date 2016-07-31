import { IDiffableNode, IDiffableElement, IDiffableValueNode, INode, IContainerNode, Element, ContainerNode, ValueNode } from "../markup";
import { IEntityDisplay } from "./display";


export interface IExpression {

  // TODO - position is something that is specific to the source of an entity, and
  // since the source could be anything, we shouldn't require a position property
  readonly position:any;
}

// TODO - IEntity should not extend INode since it is not limited to the markup lang
export interface IEntity extends INode {

  // TODO - expression needs to be source, and source should be "any"
  readonly expression:IExpression;

  /**
   */

  render();

  /*
  TODO props:

  parent: IEntity;
  children: IEntity;
  */
}

export interface IVisibleEntity extends IEntity {
  readonly display: IEntityDisplay;
}

export interface IContainerEntity extends IEntity, IContainerNode { }
