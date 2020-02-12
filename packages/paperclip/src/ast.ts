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
} & BaseNode<NodeKind.Text>;

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
} & BaseNode<NodeKind.Fragment>;

export type Slot = {
  value: string;
  children: Node[];
} & BaseNode<NodeKind.Slot>;

export type Node = Text | Element | Fragment | Slot;

export const getImports = (ast: Node): Element[] =>
  getChildrenByTagName("import", ast).filter(child => {
    return hasAttribute("src", child);
  });

export const getChildren = (ast: Node): Node[] => {
  if (ast.kind === NodeKind.Element || ast.kind === NodeKind.Fragment) {
    return ast.children;
  }
  return [];
};

export const getChildrenByTagName = (tagName: string, parent: Node) =>
  getChildren(parent).filter(child => {
    return (
      child.kind === NodeKind.Element &&
      child.tagName === tagName &&
      hasAttribute("src", child)
    );
  }) as Element[];

export const getMetaValue = (name: string, root: Node) => {
  const metaElement = getChildrenByTagName("meta", root).find(
    meta => getAttributeStringValue("name", meta) === name
  );
  return metaElement && getAttributeStringValue("content", metaElement);
};

export const getAttribute = (name: string, element: Element) =>
  element.attributes.find(attr => {
    return attr.name === name;
  });

export const getAttributeValue = (name: string, element: Element) => {
  const attr = getAttribute(name, element);
  return attr && attr.value;
};

export const getAttributeStringValue = (name: string, element: Element) => {
  const value = getAttributeValue(name, element);
  return value && value.kind === AttributeValueKind.String && value.value;
};

export const getStyleElements = (ast: Node): Element[] =>
  getChildrenByTagName("style", ast);

export const isVisibleElement = (ast: Element): boolean => {
  return !/^(import|logic|meta|style)$/.test(ast.tagName);
};

export const getVisibleChildNodes = (ast: Node): Node[] =>
  getChildren(ast).filter(child => {
    return (
      child.kind === NodeKind.Text ||
      child.kind === NodeKind.Fragment ||
      (child.kind === NodeKind.Element && isVisibleElement(child))
    );
  });

export const hasAttribute = (name: string, element: Element) =>
  getAttribute(name, element) != null;
