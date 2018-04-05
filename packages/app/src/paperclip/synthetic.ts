import { TreeNode, TreeNodeAttributes, getTeeNodePath, generateTreeChecksum, getTreeNodeFromPath, getAttribute, getNestedTreeNodeById, getTreeNodeIdMap, DEFAULT_NAMESPACE } from "../common/state/tree";
import { arraySplice, generateId, parseStyle, memoize, EMPTY_ARRAY, EMPTY_OBJECT } from "../common/utils";
import { DependencyGraph, Dependency, getModuleInfo, getComponentInfo, getNodeSourceDependency } from "./dsl";
import { renderDOM, patchDOM, computeDisplayInfo } from "./dom-renderer";
import { Bounds, Struct, shiftBounds, StructReference, Point } from "../common";
import { mapValues } from "lodash";
import { createSetAttributeTransform, OperationalTransform } from "../common/utils/tree";

export enum SyntheticObjectType {
  BROWSER,
  WINDOW,
  DOCUMENT,
  ELEMENT
};

export type SyntheticObject = {
};

export type ComputedDisplayInfo = {
  [identifier: string]: {
    bounds: ClientRect;
    style: CSSStyleDeclaration;
  }
};

export type SyntheticBrowser = {
  type: SyntheticObjectType;
  windows: SyntheticWindow[];
  graph?: DependencyGraph;
};

export type SyntheticWindow = {
  id: string;
  location: string;
  type: SyntheticObjectType;
  documents?: SyntheticDocument[];
};

export type SyntheticDocument = {
  id: string;

  // transforms from current state
  transforms?: OperationalTransform[];
  type: SyntheticObjectType;
  root: SyntheticNode;
  container: HTMLIFrameElement;
  nativeNodeMap?: any;
  computed?: ComputedDisplayInfo;
  bounds?: Bounds;
}


export type SyntheticNodeSource = {
  uri: string;
  checksum: string;
  path: number[];
};

export type SyntheticNode = {
  source: SyntheticNodeSource
} & TreeNode;

export const updateSyntheticBrowser = (properties: Partial<SyntheticBrowser>, browser: SyntheticBrowser) => ({
  ...browser,
  ...properties
});

export const updateSyntheticWindow = (location: string, properties: Partial<SyntheticWindow>, browser: SyntheticBrowser) => {
  const window = getSyntheticWindow(location, browser);
  if (!window) {
    throw new Error(`window does not exist with location: ${location}`);
  }

  const index = browser.windows.indexOf(window);
  return updateSyntheticBrowser({
    windows: arraySplice(browser.windows, index, 1, {
      ...window,
      ...properties
    })
  }, browser);
}

export const getSyntheticWindow = (location: string, browser: SyntheticBrowser) => browser.windows.find(window => window.location === location);

export const createSyntheticWindow = (location: string): SyntheticWindow => ({
  location,
  id: generateId(),
  type: SyntheticObjectType.WINDOW,
});

export const createSyntheticDocument = (root: SyntheticNode, graph: DependencyGraph): SyntheticDocument => {
  const component = getSyntheticNodeSourceNode(root, graph);

  const container = document.createElement("iframe");
  container.style.border = "none";
  container.style.width = "100%";
  container.style.height = "100%";

  const syntheticDocument: SyntheticDocument = {
    root,
    container,
    bounds: mapValues(parseStyle(getAttribute(component, "bounds", "preview")), Number) as Bounds,
    id: generateId(),
    type: SyntheticObjectType.DOCUMENT,
  };

  return syntheticDocument;
};

export const addSyntheticWindow = (window: SyntheticWindow, browser: SyntheticBrowser) => updateSyntheticBrowser({
  windows: arraySplice(browser.windows, 0, 0, window),
}, browser);

export const createSyntheticElement = (name: string, attributes: TreeNodeAttributes, children: TreeNode[], source: SyntheticNodeSource, id: string): SyntheticNode => ({
  id,
  name,
  attributes,
  children,
  source
});

export const getSytheticNodeSource = (source: TreeNode, dependency: Dependency): SyntheticNodeSource => ({
  uri: dependency.uri,
  checksum: generateTreeChecksum(dependency.content),
  path: getTeeNodePath(source, getModuleInfo(dependency.content).source),
});

export const getSyntheticNodeSourceNode = (synthetic: SyntheticNode, graph: DependencyGraph) => getTreeNodeFromPath(synthetic.source.path, graph[synthetic.source.uri].content);

export const getSyntheticWindowDependency = (window: SyntheticWindow, graph: DependencyGraph) => graph && graph[window.location];
export const getSyntheticDocumentDependency = (documentId: string, browser: SyntheticBrowser) => getSyntheticWindowDependency(getSyntheticDocumentWindow(documentId, browser), browser.graph);

export const getSyntheticDocumentComponent = (document: SyntheticDocument, graph: DependencyGraph) =>  getSyntheticNodeSourceNode(document.root, graph)

export const findSyntheticDocument = (state: SyntheticWindow|SyntheticBrowser, test: (document: SyntheticDocument) => Boolean) => {
  if (state.type === SyntheticObjectType.BROWSER) {
    for (const window of (state as SyntheticBrowser).windows) {
      const document = findSyntheticDocument(window, test);
      if (document) {
        return document;
      }
    }
    return null
  } else {
    const window = state as SyntheticWindow;
    if (window.documents) {
      for (const document of window.documents) {
        if (test(document)) {
          return document;
        }
      }
      return null;
    }
  }
};

export const getComputedNodeBounds = memoize((nodeId: string, document: SyntheticDocument) => {
  const info = document.computed;
  return info[nodeId] && info[nodeId].bounds;
});

export const getSyntheticItemBounds = memoize((value: any, browser: SyntheticBrowser) => {
  if (!value) {
    return null;
  }
  if ((value as SyntheticDocument).type === SyntheticObjectType.DOCUMENT) {
    return (value as SyntheticDocument).bounds;
  } else {

    const document = getSyntheticNodeDocument((value as SyntheticNode).id, browser);
    return shiftBounds(getComputedNodeBounds(value.id, document), document.bounds);
  }
});

export const getSyntheticDocumentWindow = memoize((documentId: string, browser: SyntheticBrowser) => browser.windows.find(window => Boolean((window.documents || EMPTY_ARRAY).find(document => document.id === documentId))));

const updateSyntheticDocument = (properties: Partial<SyntheticDocument>, documentId: string, browser: SyntheticBrowser) => {
  const window = getSyntheticDocumentWindow(documentId, browser);
  const document = getSyntheticDocumentById(documentId, window);
  return updateSyntheticWindow(window.location, {
    documents: arraySplice(window.documents, window.documents.indexOf(document), 1, {
      ...document,
      ...properties
    })
  }, browser);
}

const applyDocumentElementTransforms = (transforms: OperationalTransform[], documentId: string, browser: SyntheticBrowser) => {
  const document: SyntheticDocument = getSyntheticDocumentById(documentId, browser);
  patchDOM(transforms, document.container.contentDocument.body.children[0] as HTMLElement);
  return updateSyntheticDocument({
    computed: computeDisplayInfo(document.nativeNodeMap)
  }, document.id, browser);
};

const updateSyntheticItem = <TItem>(properties: Partial<TItem>, ref: StructReference<any>, browser: SyntheticBrowser) => {
  if (ref.type === SyntheticObjectType.DOCUMENT) {
    const document = getSyntheticDocumentById(ref.id, browser);
    throw new Error("TODO - modify document, and source");
  }
  const document = getSyntheticNodeDocument(ref.id, browser);
  const item = getNestedTreeNodeById(ref.id, document.root) as SyntheticNode;
  const itemPath = getTeeNodePath(item, document.root);

  const transforms: OperationalTransform[] = [];

  const props: Partial<TreeNode> = properties;

  if (props.attributes) {
    for (const namespace in props.attributes) {
      for (const name in props.attributes[namespace]) {
        const value = props.attributes[namespace][name];
        if (getAttribute(item, name, namespace) === value) continue;
        transforms.push(createSetAttributeTransform(itemPath, name, namespace, value));
      }
    }
  }

  browser = applyDocumentElementTransforms(transforms, document.id, browser);

  // TODO - patch synthetic document with OTs

  return browser;
};

export const updateSyntheticNodeAttributes = (name: string, namespace: string, value: any, ref: StructReference<SyntheticObjectType.ELEMENT>, browser: SyntheticBrowser) => {
  const node = getSyntheticNodeById(ref.id, browser);

  return updateSyntheticItem({
    attributes: {
      [namespace]: {
        ...(node.attributes[namespace] || EMPTY_OBJECT),
        [name]: value
      }
    }
  }, ref, browser);
};

export const updateSyntheticNodeStyle = (style: any, ref: StructReference<SyntheticObjectType.ELEMENT>, browser: SyntheticBrowser) => {
  const node = getSyntheticNodeById(ref.id, browser);
  const oldStyle = getAttribute(node, "style") || EMPTY_OBJECT;

  return updateSyntheticNodeAttributes("style", DEFAULT_NAMESPACE, {
    ...oldStyle,
    ...style,
  }, ref, browser);
};

export const getSyntheticNodeById = (nodeId: string, browser: SyntheticBrowser) => {
  const document = getSyntheticNodeDocument(nodeId, browser);
  return getNestedTreeNodeById(nodeId, document.root);
};


export const updateSyntheticItemPosition = (position: Point, ref: StructReference<any>, browser: SyntheticBrowser) => {
  if (ref.type === SyntheticObjectType.DOCUMENT) {
    throw new Error("NOT DONE");
  } else {
    const node = getSyntheticNodeById(ref.id, browser);
    const style = getAttribute(node, "style") || EMPTY_OBJECT;
    return updateSyntheticNodeStyle({
      position: style.position || "relative",
      left: position.left,
      top: position.top
    }, ref, browser);
  }
};

export const getSyntheticDocumentById = memoize((documentId: string, state: SyntheticWindow|SyntheticBrowser) => findSyntheticDocument(state, document => document.id === documentId));

export const getSyntheticNodeDocument = memoize((nodeId: string, state: SyntheticBrowser|SyntheticWindow): SyntheticDocument => findSyntheticDocument(state, document => Boolean(getNestedTreeNodeById(nodeId, document.root))));
