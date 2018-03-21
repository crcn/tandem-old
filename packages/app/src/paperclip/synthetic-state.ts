export enum SyntheticObjectType {
  WINDOW,
  DOCUMENT,
  ELEMENT,
  TEXT_NODE
};

export type SyntheticObject = {
  type: SyntheticObjectType
};

export type SyntheticWindow = {
  document: SyntheticDocument
};

export type SyntheticNode = {} & SyntheticObject;

export type SyntheticParentNode = {
  children: SyntheticNode[]
} & SyntheticNode;

export type SyntheticDocument = {
  
} & SyntheticParentNode;

export type SyntheticElement = {
  attributes: {
    [identifier: string]: string
  }
} & SyntheticParentNode;

export type SyntheticTextNode = {
  value: string;
} & SyntheticNode;

