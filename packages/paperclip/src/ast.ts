import { Statement } from "./js-ast";
import { Sheet } from "./css-ast";
import { SourceLocation } from "./base-ast";

export enum NodeKind {
  Fragment = "Fragment",
  Text = "Text",
  Element = "Element",
  StyleElement = "StyleElement",
  Slot = "Slot"
}

export type BaseNode<TKind extends NodeKind> = {
  kind: TKind;
};

export type Text = {
  value: string;
} & BaseNode<NodeKind.Text>;

export type Element = {
  openTagLocation: SourceLocation;
  tagNameLocation: SourceLocation;
  tagName: string;
  attributes: Attribute[];
  value: string;
  children: Node[];
} & BaseNode<NodeKind.Element>;

export type StyleElement = {
  sheet: Sheet;
} & BaseNode<NodeKind.StyleElement>;

export enum AttributeKind {
  ShorthandAttribute = "ShorthandAttribute",
  KeyValueAttribute = "KeyValueAttribute"
}

type BaseAttribute<TKind extends AttributeKind> = {
  kind: TKind;
};

type ShorthandAttribute = {
  reference: Statement;
} & BaseAttribute<AttributeKind.ShorthandAttribute>;

type KeyValueAttribute = {
  name: string;
  value?: AttributeValue;
} & BaseAttribute<AttributeKind.KeyValueAttribute>;

export type Attribute = ShorthandAttribute | KeyValueAttribute;

export enum AttributeValueKind {
  String = "String",
  Slot = "Slot"
}

export type BaseAttributeValue<TKind extends AttributeValueKind> = {
  attrValueKind: TKind;
};

export type StringAttributeValue = {
  value: string;
  location: SourceLocation;
} & BaseAttributeValue<AttributeValueKind.String>;

export type SlotAttributeValue = Statement &
  BaseAttributeValue<AttributeValueKind.Slot>;

export type AttributeValue = StringAttributeValue | SlotAttributeValue;

export type Fragment = {
  value: string;
  children: Node[];
} & BaseNode<NodeKind.Fragment>;

export type Slot = {
  script: Statement;
} & BaseNode<NodeKind.Slot>;

export type Node = Text | Element | StyleElement | Fragment | Slot;

export const getImports = (ast: Node): Element[] =>
  getChildrenByTagName("import", ast).filter(child => {
    return hasAttribute("src", child);
  });

export const getImportIds = (ast: Node): string[] =>
  getImports(ast)
    .map(node => getAttributeStringValue("id", node))
    .filter(Boolean) as string[];

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
    return attr.kind === AttributeKind.KeyValueAttribute && attr.name === name;
  }) as KeyValueAttribute;

export const getAttributeValue = (name: string, element: Element) => {
  const attr = getAttribute(name, element);
  return attr && attr.value;
};

export const getAttributeStringValue = (name: string, element: Element) => {
  const value = getAttributeValue(name, element);
  return (
    value && value.attrValueKind === AttributeValueKind.String && value.value
  );
};

export const getStyleElements = (ast: Node): StyleElement[] =>
  getChildren(ast).filter(
    child => child.kind === NodeKind.StyleElement
  ) as StyleElement[];

export const isVisibleElement = (ast: Element): boolean => {
  return !/^(import|logic|meta|style|part)$/.test(ast.tagName);
};
export const isVisibleNode = (node: Node): boolean =>
  node.kind === NodeKind.Text ||
  node.kind === NodeKind.Fragment ||
  node.kind === NodeKind.Slot ||
  (node.kind === NodeKind.Element && isVisibleElement(node));

export const getVisibleChildNodes = (ast: Node): Node[] =>
  getChildren(ast).filter(isVisibleNode);

export const getParts = (ast: Node): Element[] =>
  getChildren(ast).filter(child => {
    return (
      child.kind === NodeKind.Element &&
      child.tagName === "part" &&
      hasAttribute("id", child)
    );
  }) as Element[];

export const hasAttribute = (name: string, element: Element) =>
  getAttribute(name, element) != null;
