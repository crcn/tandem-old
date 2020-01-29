export enum VirtualNodeType {
  Element = "Element",
  Text = "Text",
  Fragment = "Fragment"
}

type VirtualBaseNode<TType extends VirtualNodeType> = {
  type: TType;
};

export type VirtualAttribute = {
  name: string;
  value: string;
};
export type VirtualElement = {
  attributes: VirtualAttribute[];
  children: VirtualNode;
} & VirtualBaseNode<VirtualNodeType.Element>;

export type VirtualText = {
  value: string;
} & VirtualBaseNode<VirtualNodeType.Element>;

export type VirtualNode = VirtualElement | VirtualText;
