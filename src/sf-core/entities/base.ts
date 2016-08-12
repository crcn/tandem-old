import { IDiffableNode, IDiffableElement, IDiffableValueNode, INode, IContainerNode, Element, ContainerNode, ValueNode } from "../markup";
import { IEntityDisplay } from "./display";
import { IDisposable } from "../object";

export interface ICursor {
  start: number;
  end: number;
}

// export interface IEntityDisplayMutator extends IEntityMutator {
//   appendChild(child: IEntity);
//   removeChild(child: IEntity);
// }


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
}

export interface IVisibleEntity extends IEntity {
  readonly display: IEntityDisplay;
}

export interface IContainerEntity extends IEntity, IContainerNode { }
