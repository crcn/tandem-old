import { INode, IContainerNode } from "../base";

export interface IMarkupSectionMarker {

}

export interface IMarkupSection {
  createMarker(): IMarkupSectionMarker;
  targetNode: IContainerNode;
  appendChild(node: INode);
  toFragment(): IContainerNode;
  visible: boolean;
  childNodes: Array<INode>;
  show(): void;
  hide(): void;
  remove(): void;
  clone(): IMarkupSection;
}