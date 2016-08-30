
export interface IDOMSectionMarker {

}

export interface IDOMSection {
  createMarker(): IDOMSectionMarker;
  targetNode: Node;
  appendChild(node: Node);
  toFragment(): Node;
  visible: boolean;
  innerHTML: string;
  childNodes: Array<Node>;
  show(): void;
  hide(): void;
  remove(): void;
  clone(): IDOMSection;
}