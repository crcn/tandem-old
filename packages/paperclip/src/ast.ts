export enum NodeKind {
  Fragment = "Fragment",
  Text = "Text",
  Element = "Element",
  Slot = "Slot"
}

export type BaseNode<TKind extends NodeKind> = {
  kind: TKind;
};

export type Text = {
  value: string;
} & BaseNode<NodeKind.Element>;

export type Element = {
  tagName: string;
  attributes: Attribute[];
  value: string;
  children: Node[];
} & BaseNode<NodeKind.Element>;

export type Attribute = {
  name: string;
  value?: AttributeValue;
};

export enum AttributeValueKind {
  String = "String",
  Slot = "Slot"
}

export type BaseAttributeValue<TKind extends AttributeValueKind> = {
  kind: TKind;
};

export type StringAttributeValue = {
  value: string;
} & BaseAttributeValue<AttributeValueKind.String>;

export type SlotAttributeValue = {} & BaseAttributeValue<
  AttributeValueKind.Slot
>;

export type AttributeValue = StringAttributeValue | SlotAttributeValue;

export type Fragment = {
  value: string;
  children: Node[];
} & BaseNode<NodeKind.Element>;

export type Slot = {
  value: string;
  children: Node[];
} & BaseNode<NodeKind.Element>;

export type Node = Text | Element | Fragment | Slot;
