export enum NodeType {
  ELEMENT = 1,
  ATTRIBUTE = 2,
  TEXT= 3,
  DOCUMENT = 9,
  DOCUMENT_FRAGMENT = 11,
};

export type VMObject = {

  // the sourc of the VM Object
  source: any;
}

export type BaseNode = {
  type: NodeType;
} & VMObject;

export type ParentNode = {
  childNodes: BaseNode[];
} & BaseNode;

export type TextNode = {
  value: string;
} & BaseNode;

export type Fragment = {

} & BaseNode;

export type ElementAttribute = {
  name: string;
  value: string;
};

export type Element = {
  tagName: string;
  attributes: ElementAttribute[];
  shadow: Document;
} & ParentNode;


export type StyleSheet = {
  rules: StyleRule[];
}

export type StyleRule = {

}