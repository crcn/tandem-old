import { INode, IElement } from '../markup';

export interface IEntityController {

  /**
   * renders new children for the entity based
   * on the source
   */

  render():Array<INode>|INode;
}

export interface IEntity extends IElement {

  /**
   * source of the entity
   */

  source:any;

  /**
   * controls how the entity is rendered based on the source
   */

  controller:IEntityController;

  /**
   * updates the entity from the source
   */

  update():void;
}