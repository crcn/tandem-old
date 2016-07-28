import { IDiffableNode, IDiffableElement, IDiffableValueNode, INode, IContainerNode, Element, ContainerNode, ValueNode } from "../markup";
import { IEntityDisplay } from "./display";

export interface IEntity extends INode {

  /**
   */

  render();
}

export interface IVisibleEntity extends IEntity {
  readonly display: IEntityDisplay;
}

export interface IContainerEntity extends IEntity, IContainerNode {

}

export class ElementEntity extends Element implements IEntity {
  constructor(readonly source: IDiffableElement) {
    super(source.nodeName);

    // TODO - attributes might need to be transformed here
    if (source.attributes) {
      for (const attribute of source.attributes) {
        this.setAttribute(attribute.name, attribute.value);
      }
    }
  }

  render(): any {
    return this.source.childNodes;
  }

  cloneNode(deep?: boolean) {
    const clone = new ElementEntity(this.source);
    if (deep) {
      this.addChildNodesToClonedNode(clone);
    }
    return clone;
  }
}

export class ValueNodeEntity extends ValueNode implements IEntity {
  constructor(readonly source: IDiffableValueNode) {
    super(source.nodeName, source.nodeValue);
  }
  render() {
    return null;
  }
  cloneNode(deep?: boolean) {
    const clone = new ValueNodeEntity(this.source);
    return clone;
  }
}
