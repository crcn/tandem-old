import { IDiffableNode, IDiffableElement, IDiffableValueNode, INode, IContainerNode, Element, ContainerNode, ValueNode } from "../markup";
import { IEntityDisplay } from "./display";
import { IDisposable } from "../object";

export interface IExpression {

  // TODO - position is something that is specific to the source of an entity, and
  // since the source could be anything, we shouldn't require a position property
  readonly position:any;
}

// TODO - IEntity should not extend INode since it is not limited to the markup lang
// TODO - should extend ITyped interface
export interface IEntity extends INode, IDisposable {

  // TODO - expression needs to be source, and source should be "any"
  expression:IExpression;

  /**
   * the type property helps other parts of the application figure out how
   * how this *type* of entity should be handled -- much better than using
   * other methods such as instanceof, or constructor.name
   */

  readonly type: string;

  /**
   */

  render();
}

export interface IVisibleEntity extends IEntity {
  readonly display: IEntityDisplay;
}

export interface IContainerEntity extends IEntity, IContainerNode { }
