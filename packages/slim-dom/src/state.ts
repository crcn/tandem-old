export enum NodeType {
  ELEMENT = 1,
  TEXT= 3,
  DOCUMENT = 9,
  DOCUMENT_FRAGMENT = 11,
};

export type SourcePosition = {
  line: number;
  column: number;
  pos: number;
};

export type SourceRange = {
  start: SourcePosition;
  end: SourcePosition;
};

export type VMObjectSource = {
  type?: string|number;
  uri: string;
  range: SourceRange;
};

export type VMObject = {

  // the sourc of the VM Object
  source: VMObjectSource;
};

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
  value: any;
};

export type Element = {
  tagName: string;
  attributes: ElementAttribute[];
  shadow: ParentNode;
} & ParentNode;


export type StyleSheet = {
  rules: StyleRule[];
}

export type StyleRule = {

}