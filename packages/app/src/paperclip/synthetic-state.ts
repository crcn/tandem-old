import { DependencyGraph } from "./loader-state";
import { Expression, ExpressionType, ExpressionRange } from "./expression-state";
import { arraySplice } from "common/utils";

export enum SyntheticObjectType {
  BROWSER,
  WINDOW,
  DOCUMENT,
  ELEMENT,
  TEXT_NODE
};

export type SyntheticObjectSource = {
  uri: string;
  type: ExpressionType;
  range: ExpressionRange;
};

export type SyntheticObject = {
  type: SyntheticObjectType;
  source: SyntheticObjectSource;
};

export type ComputedInfo = {
  [identifier: string]: {
    rect: ClientRect;
    style: CSSStyleDeclaration;
  }
};

export type SyntheticBrowser = {
  type: SyntheticObjectType;
  windows: SyntheticWindow[];
  graph?: DependencyGraph;
};

export type SyntheticWindow = {
  location: string;
  type: SyntheticObjectType;
  document?: SyntheticDocument;
  mount: HTMLElement;
  computed?: ComputedInfo
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

export const updateSyntheticBrowser = (properties: Partial<SyntheticBrowser>, browser: SyntheticBrowser) => ({
  ...browser,
  ...properties
});

export const getSyntheticWindow = (uri: string, browser: SyntheticBrowser) => browser.windows.find(window => window.location === uri);

export const createSyntheticWindow = (location: string): SyntheticWindow => ({
  location,
  mount: document.createElement("div"),
  type: SyntheticObjectType.WINDOW,
});

export const addSyntheticWindow = (window: SyntheticWindow, browser: SyntheticBrowser) => updateSyntheticBrowser({
  windows: arraySplice(browser.windows, 0, 0, window),
}, browser);