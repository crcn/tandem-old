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

export interface IContainerEntity extends IEntity, IContainerNode {
  appendSourceChildNode(childSource: any): IEntity;
}

export interface IElementEntity extends IContainerEntity {
  setSourceAttribute(key: string, value: string);
}
