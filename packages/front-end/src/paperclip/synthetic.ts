import { TreeNodeAttributes, getTeeNodePath, generateTreeChecksum, getTreeNodeFromPath, getAttribute, getNestedTreeNodeById, getTreeNodeIdMap, DEFAULT_NAMESPACE, updateNestedNode, setNodeAttribute, findNodeByTagName, TreeNode, TreeNodeUpdater, findNestedNode, addTreeNodeIds, removeNestedTreeNode, updateNestedNodeTrail, appendChildNode, replaceNestedNode, getParentTreeNode, cloneNode, getTreeNodeUidGenerator } from "../common/state/tree";
import { arraySplice, generateId, memoize, EMPTY_ARRAY, EMPTY_OBJECT, stringifyTreeNodeToXML, ArrayOperationalTransform, castStyle, createUIDGenerator } from "../common/utils";
import { DependencyGraph, Dependency, getModuleInfo, getComponentInfo, getNodeSourceDependency, updateGraphDependency, getDependents, SetAttributeOverride, getNodeSourceModule, getNodeSourceComponent } from "./dsl";
import { renderDOM, patchDOM, computeDisplayInfo } from "./dom-renderer";
import { Bounds, Struct, shiftBounds, StructReference, Point, getBoundsSize, pointIntersectsBounds, moveBounds, boundsFromRect, parseStyle } from "../common";
import { mapValues, pull } from "lodash";
import { createSetAttributeTransform, OperationalTransform, diffNode, patchNode, OperationalTransformType, SetAttributeTransform } from "../common/utils/tree";
import { evaluateDependencyEntry } from "./evaluate";
import { STATUS_CODES } from "http";
import { Children, SyntheticEvent } from "react";

export const EDITOR_NAMESPACE = "editor";
const DEFAULT_BOUNDS = {
  left: 0,
  top: 0,
  right: 400,
  bottom: 300
};

const PASTED_ARTBOARD_OFFSET = {
  left: 20,
  top: 20
};

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
  path: number[];
};

export type SyntheticNode = {
  source: SyntheticNodeSource;
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

export const isSyntheticDocumentRoot = (nodeId: string, state: SyntheticWindow|SyntheticBrowser) => {
  const document = getSyntheticNodeDocument(nodeId, state);
  return document.root.id === nodeId;
};

export const getSyntheticWindow = (location: string, browser: SyntheticBrowser) => browser.windows.find(window => window.location === location);

export const createSyntheticWindow = (location: string): SyntheticWindow => ({
  location,
  id: generateId(),
  type: SyntheticObjectType.WINDOW,
});

const calculateRootNodeBounds = (rootSourceNode: TreeNode) =>  {
  const style = getAttribute(rootSourceNode, "style");
  return style || DEFAULT_BOUNDS;
};

const getSyntheticDocumentBounds = (documentRootNode: SyntheticNode, moduleRootNode: TreeNode) => {
  const rootSourceNode = getTreeNodeFromPath(documentRootNode.source.path, moduleRootNode);
  const bounds = getAttribute(rootSourceNode, "bounds", EDITOR_NAMESPACE) || calculateRootNodeBounds(rootSourceNode);
  return typeof bounds === "string" ? mapValues(parseStyle(bounds), Number) as Bounds : bounds;
};

export const createSyntheticDocument = (documentRootNode: SyntheticNode, moduleRootNode: TreeNode): SyntheticDocument => {

  const container = document.createElement("iframe");
  container.style.border = "none";
  container.style.width = "100%";
  container.style.height = "100%";
  container.addEventListener('load', () => {
    Object.assign(container.contentDocument.body.style, {
      padding: 0,
      margin: 0
    });
  });

  const syntheticDocument: SyntheticDocument = {
    root: documentRootNode,
    container,
    bounds: getSyntheticDocumentBounds(documentRootNode, moduleRootNode),
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
  source,
});

export const getSytheticNodeSource = (source: TreeNode, dependency: Dependency): SyntheticNodeSource => ({
  uri: dependency.uri,
  path: getTeeNodePath(source.id, getModuleInfo(dependency.content).source),
});

export const getSyntheticSourceNode = (syntheticNodeId: string, browser: SyntheticBrowser) => {
  const synthetic = getSyntheticNodeById(syntheticNodeId, browser);
  return getTreeNodeFromPath(synthetic.source.path, browser.graph[synthetic.source.uri].content);
};

export const getSyntheticWindowDependency = (window: SyntheticWindow, graph: DependencyGraph) => graph && graph[window.location];
export const getSyntheticDocumentDependency = (documentId: string, browser: SyntheticBrowser) => getSyntheticWindowDependency(getSyntheticDocumentWindow(documentId, browser), browser.graph);
export const getSyntheticDocumentSourceNode = (document: SyntheticDocument, browser: SyntheticBrowser) => getSyntheticSourceNode(document.root.id, browser);

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

export const getSyntheticNodeBounds = memoize((nodeId: string, browser: SyntheticBrowser) => {
  if (isSyntheticDocumentRoot(nodeId, browser)) {
    return getSyntheticNodeDocument(nodeId, browser).bounds;
  } else {

    const document = getSyntheticNodeDocument(nodeId, browser);
    return shiftBounds(getComputedNodeBounds(nodeId, document), document.bounds);
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
  const nativeNodeMap = patchDOM(transforms, document.root, document.container.contentDocument.body.children[0] as HTMLElement, document.nativeNodeMap);
  return updateSyntheticDocument({
    computed: computeDisplayInfo(nativeNodeMap),
    nativeNodeMap
  }, document.id, browser);
};


const updateSyntheticItem = <TItem>(properties: Partial<TItem>, nodeId: string, browser: SyntheticBrowser) => {
  if (isSyntheticDocumentRoot(nodeId, browser)) {
    const document = getSyntheticNodeDocument(nodeId, browser);
    throw new Error("TODO - modify document, and source");
  }
  const document = getSyntheticNodeDocument(nodeId, browser);
  const item = getNestedTreeNodeById(nodeId, document.root) as SyntheticNode;
  const itemPath = getTeeNodePath(item.id, document.root);

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

export const updateSyntheticNodeAttributes = (name: string, namespace: string, value: any, nodeId, browser: SyntheticBrowser) => {
  const node = getSyntheticNodeById(nodeId, browser);

  return updateSyntheticItem({
    attributes: {
      [namespace]: {
        ...(node.attributes[namespace] || EMPTY_OBJECT),
        [name]: value
      }
    }
  }, nodeId, browser);
};

export const updateSyntheticNodeStyle = (style: any, nodeId: string, browser: SyntheticBrowser) => {
  const node = getSyntheticNodeById(nodeId, browser);
  const oldStyle = getAttribute(node, "style") || EMPTY_OBJECT;

  return updateSyntheticNodeAttributes("style", DEFAULT_NAMESPACE, {
    ...oldStyle,
    ...style,
  }, nodeId, browser);
};

export const getSyntheticNodeById = (nodeId: string, browser: SyntheticBrowser) => {
  const document = getSyntheticNodeDocument(nodeId, browser);
  return document && getNestedTreeNodeById(nodeId, document.root) as SyntheticNode;
};

export const getSourceNodeById = (nodeId: string, browser: SyntheticBrowser) => {
  const dependency = getSourceNodeDependency(nodeId, browser);
  return dependency && getNestedTreeNodeById(nodeId, dependency.content);
};

export const getSourceNodeDependency = memoize((nodeId: string, browser: SyntheticBrowser): Dependency => {
  for (const uri in browser.graph) {
    const dep = browser.graph[uri];
    if (getNestedTreeNodeById(nodeId, dep.content)) {
      return dep;
    }
  }
  return null;
});

export const getSyntheticNodeSourceComponent = memoize((nodeId: string, browser: SyntheticBrowser) => {
  const document = getSyntheticNodeDocument(nodeId, browser);
  const componentNode = getSyntheticSourceNode(document.root.id, browser);
  if (!componentNode) {
    return null;
  }
  return getComponentInfo(componentNode);
});

export const updateSyntheticItemPosition = (position: Point, nodeId: string, browser: SyntheticBrowser) => {
  const bounds = getSyntheticNodeBounds(nodeId, browser);
  return updateSyntheticItemBounds(moveBounds(bounds, position), nodeId, browser, PersistBoundsFilter.POSITION);
};

enum PersistBoundsFilter {
  WIDTH = 1,
  HEIGHT = 1 << 1,
  POSITION = 1 << 2
};

export const updateSyntheticItemBounds = (bounds: Bounds, nodeId: string, browser: SyntheticBrowser, filter: PersistBoundsFilter = PersistBoundsFilter.HEIGHT | PersistBoundsFilter.POSITION | PersistBoundsFilter.WIDTH) => {
  if (isSyntheticDocumentRoot(nodeId, browser)) {
    return updateSyntheticDocument({
      bounds,
    }, getSyntheticNodeDocument(nodeId, browser).id, browser);
  } else {
    const node = getSyntheticNodeById(nodeId, browser);
    const document = getSyntheticNodeDocument(nodeId, browser);
    const style = getAttribute(node, "style") || EMPTY_OBJECT;

    let newStyle: any = {
      position: style.position || "relative",
    };

    if (filter & PersistBoundsFilter.POSITION) {
      const pos =  {
        left: bounds.left - document.bounds.left,
        top: bounds.top - document.bounds.top,
      };

      newStyle = {
        ...newStyle,
        ...pos
      };
    }

    if (filter & PersistBoundsFilter.WIDTH) {
      newStyle = {
        ...newStyle,
        width: bounds.right - bounds.left
      };
    }

    if (filter & PersistBoundsFilter.HEIGHT) {
      newStyle = {
        ...newStyle,
        height: bounds.bottom - bounds.top
      };
    }

    return updateSyntheticNodeStyle(newStyle, nodeId, browser);
  }
};

export const persistPasteSyntheticNodes = (dependencyUri: string, sourceNodeId: string, syntheticNodes: SyntheticNode[], browser: SyntheticBrowser) => {
  const targetDep = browser.graph[dependencyUri];
  let targetSourceNode =  getParentTreeNode(sourceNodeId, targetDep.content) || getNestedTreeNodeById(sourceNodeId, targetDep.content);


  const newContent = syntheticNodes.reduce((content, syntheticNode) => {
    const sourceDep = browser.graph[syntheticNode.source.uri];
    const generateUid = getTreeNodeUidGenerator(sourceDep.content);
    const sourceNode = getSyntheticSourceNode(syntheticNode.id, browser);

    // If there is NO source node, then possibly create a detached node and add to target component
    if (!sourceNode) {
      throw new Error("not implemented");
    }

    // is component
    if (sourceNode.name === "component") {

      // TODO - need to possibly import import component
      if (syntheticNode.source.uri !== targetDep.uri) {
        throw new Error("NOT IMPLEMENTED YET");
      }

      const childComponentNode = createComponentNode(
        targetDep,
        shiftBounds(castStyle(getAttribute(sourceNode, "bounds", EDITOR_NAMESPACE)), PASTED_ARTBOARD_OFFSET),
        getAttribute(sourceNode, "id")
      );

      return {
        ...content,
        children: [
          ...content.children,
          childComponentNode
        ]
      }
    } else {
      return updateNestedNode(targetSourceNode, content, (target) => appendChildNode(cloneNode(sourceNode, generateUid), target));
    }


  }, targetDep.content);

  return updateDependencyAndRevaluate({
    content: newContent
  }, targetDep.uri, browser);
}

export const getSyntheticDocumentById = memoize((documentId: string, state: SyntheticWindow|SyntheticBrowser) => findSyntheticDocument(state, document => document.id === documentId));

export const getSyntheticNodeDocument = memoize((nodeId: string, state: SyntheticBrowser|SyntheticWindow): SyntheticDocument => findSyntheticDocument(state, document => {
  return Boolean(getNestedTreeNodeById(nodeId, document.root));
}));

export const setSyntheticNodeExpanded = (node: SyntheticNode, value: boolean, root: SyntheticNode): SyntheticNode => {
  const path = getTeeNodePath(node.id, root);
  const updater = (node) => {
    return setNodeAttribute(node, "expanded", value, EDITOR_NAMESPACE);
  };
  return (value ? updateNestedNodeTrail(path, root, updater) : updateNestedNode(node, root, updater)) as SyntheticNode;
};

export const expandSyntheticNode = (node: SyntheticNode, root: SyntheticNode) => setSyntheticNodeExpanded(node, true, root);
export const collapseSyntheticNode = (node: SyntheticNode, root: SyntheticNode) => setSyntheticNodeExpanded(node, false, root);

export const getSyntheticNodeWindow = memoize((nodeId: string, state: SyntheticBrowser) => getSyntheticDocumentWindow(getSyntheticNodeDocument(nodeId, state).id, state));

const persistSyntheticNodeChanges = (nodeId: string, browser: SyntheticBrowser, updater: TreeNodeUpdater) => {

  const syntheticDocument = getSyntheticNodeDocument(nodeId, browser);
  const syntheticNode = getSyntheticNodeById(nodeId, browser);

  const sourceNode = getSyntheticSourceNode(syntheticNode.id, browser);
  const sourceDependency = browser.graph[syntheticNode.source.uri];
  const sourceComponent = getSyntheticNodeSourceComponent(nodeId, browser);

  let updatedModuleSourceNode = updateNestedNode(sourceNode, sourceDependency.content, updater);

  // TODO - use this prop to use overrides or not
  const sourceComponentContainsSourceNode = Boolean(getNestedTreeNodeById(sourceNode.id, sourceComponent.source));

  // set override.
    // TODO - recompute overrides
    if (!sourceComponentContainsSourceNode) {
      const ots = diffNode(sourceDependency.content, updatedModuleSourceNode);
      updatedModuleSourceNode = sourceDependency.content;

      if (ots.length) {
        updatedModuleSourceNode = updateNestedNode(sourceComponent.source, updatedModuleSourceNode, (child) => {
          const overrides = child.children.find(child => child.name === "overrides");
          if (overrides) {
            return child;
          }

          return {
            ...child,
            children: [
              ...child.children,
              { name: "overrides", children: [], attributes: {}, id: child.id + "overrides" }
            ]
          };
        });
      }

      const overrideChildren: TreeNode[] = [];
      let overrides = findNodeByTagName(updatedModuleSourceNode, "overrides");
      const targetName = getAttribute(sourceNode, "ref");
      for (const ot of ots) {
        switch(ot.type) {
          case OperationalTransformType.SET_ATTRIBUTE: {
            const { name, value, namespace } = ot as SetAttributeTransform;
            if (name === "style" && namespace === DEFAULT_NAMESPACE) {
              overrides = addSetStyleOverride(value, targetName, overrides);
            }
            break;
          }
          case OperationalTransformType.REMOVE_CHILD: {

            // set display none override since the parent template should be immutable
            overrides = addSetStyleOverride({ display: "none" }, targetName, overrides);
            break;
          }
          default: {
            throw new Error(`cannot override with ${OperationalTransformType.REMOVE_CHILD} operational transform.`);
          }
        }
      }

      if (ots.length) {
        updatedModuleSourceNode = replaceNestedNode(overrides, overrides.id, updatedModuleSourceNode);
      }
    }

    return updateDependencyAndRevaluate({
      content: updatedModuleSourceNode
    }, sourceDependency.uri, browser);
};

const addSetStyleOverride = (style: any, targetName: string, overridesNode: TreeNode) => {
  for (const key in style) {
    const existingStyleOverride = findNestedNode(overridesNode, (node) => node.name === "set-style" && getAttribute(node, "name") === key && getAttribute(node, "target") === targetName);
    if (existingStyleOverride) {
      overridesNode = updateNestedNode(existingStyleOverride, overridesNode, (child) => {
        return {
          ...child,
          attributes: {
            ...child.attributes,
            [DEFAULT_NAMESPACE]: {
              ...(child.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT),
              value: style[key]
            }
          }
        }
      });
    } else {
      return appendChildNode({
        name: "set-style",
        id: overridesNode.id + "set-style" + key,
        attributes: {
          [DEFAULT_NAMESPACE]: {
            name: key,
            value: style[key],
            target: targetName,
          }
        },
        children: []
      }, overridesNode);
    }
  }
}

export const replaceDependency = (dep: Dependency, browser: SyntheticBrowser) => updateDependencyAndRevaluate(dep, dep.uri, browser);

const updateDependencyAndRevaluate = (properties: Partial<Dependency>, dependencyUri: string, browser: SyntheticBrowser) => {

  const oldBrowser = browser;
  const graph = updateGraphDependency(properties, dependencyUri, browser.graph);

  browser = updateSyntheticBrowser({
    graph: graph
  }, browser);

  // TODO - evaluate sourceDep dependents & update assoc windows

  const sourceDependents = getDependents(dependencyUri, graph);
  const sourceDependentUris = [];

  for (const dep of sourceDependents) {
    sourceDependentUris.push(dep.uri);
  }

  let depWindows: SyntheticWindow[] = [];
  for (const window of browser.windows) {
    if (sourceDependentUris.indexOf(window.location) === -1) {
      continue;
    }

    const { documentNodes } = evaluateDependencyEntry({
      entry: graph[window.location],
      graph
    });

    browser = updateSyntheticWindow(window.location, {
      documents: documentNodes.map(newDocumentNode => {
        const sourceComponent = getComponentInfo(getTreeNodeFromPath(newDocumentNode.source.path, browser.graph[newDocumentNode.source.uri].content));
        const document = window.documents.find(document => {
          const documentSourceNode = getSyntheticDocumentSourceNode(document, oldBrowser);
          return documentSourceNode.id === sourceComponent.source.id;
        });
        if (!document) {
          const newDocument = createSyntheticDocument(newDocumentNode, graph[window.location].content);
          return newDocument;
        }
        const ots = filterEditorOts(diffNode(document.root, newDocumentNode));
        const newRoot = copyTreeSources(patchNode(ots, document.root), newDocumentNode);
        const nativeNodeMap = document.container.contentDocument ? patchDOM(ots, document.root, document.container.contentDocument.body.children[0] as HTMLElement, document.nativeNodeMap) : document.nativeNodeMap;
        return {
          ...document,
          bounds: getSyntheticDocumentBounds(newRoot, graph[window.location].content),
          nativeNodeMap,
          computed: computeDisplayInfo(nativeNodeMap),
          root: newRoot
        }
      })
    }, browser);
  }

  return browser;
};

const filterEditorOts = (ots: OperationalTransform[]) => ots.filter(ot => {
  switch(ot.type) {
    case OperationalTransformType.SET_ATTRIBUTE: {
      return (ot as SetAttributeTransform).namespace !== EDITOR_NAMESPACE;
    }
  }
  return true;
});

const copyTreeSources = (a: SyntheticNode, b: SyntheticNode) => {
  let na = a;

  if (!syntheticSourceEquals(a.source, b.source)) {
    na = { ...na, source: b.source };
  }

  let newChildren;

  for (let i = a.children.length; i--;) {
    const c = a.children[i]
    const nc = copyTreeSources(c as SyntheticNode, b.children[i] as SyntheticNode);

    if (c !== nc) {
      if (!newChildren) {
        newChildren = a.children.slice(i + 1);
      }
    }

    if (newChildren) {
      newChildren.unshift(nc)
    }
  }

  if (newChildren) {
    return { ...na, children: newChildren };
  }

  return na;
};

const syntheticSourceEquals = (a: SyntheticNodeSource, b: SyntheticNodeSource) => {
  return a.uri === b.uri && a.path.join("") === b.path.join("");
};

const generateComponentId = (moduleNode: TreeNode) => {

  let i = moduleNode.children.length;
  let cid;

  while(1) {
    cid = "component" + (++i);
    const component = moduleNode.children.find(child => getAttribute(child, "id") === cid);
    if (!component) break;
  }
  return cid;
}

const createComponentNode = (dep: Dependency, bounds?: Bounds, parentId?: string) => {
  return addTreeNodeIds({
    name: "component",
    attributes: {
      [DEFAULT_NAMESPACE]: {
        id: generateComponentId(dep.content),
        extends: parentId
      },
      [EDITOR_NAMESPACE]: {
        bounds
      }
    },
    children: [
      {
        name: "template",
        attributes: {},
        children: []
      }
    ]
  }, dep.content.id);
};

export const persistNewComponent = (bounds: Bounds, dependencyUri: string, browser: SyntheticBrowser) => {
  const dep = browser.graph[dependencyUri];

  const newComponentNode: TreeNode = createComponentNode(dep, bounds);

  return updateDependencyAndRevaluate({
    content: {
      ...dep.content,
      children: [
        ...dep.content.children,
        newComponentNode
      ]
    }
  }, dependencyUri, browser);
};

export const persistInsertRectangle = (style: any, targetSourceNodeId: string, browser: SyntheticBrowser) => {
  return persistInsertNode({
    name: "div",
    attributes: {
      [DEFAULT_NAMESPACE]: {
        style
      },
      [EDITOR_NAMESPACE]: {
        label: "Rectangle"
      }
    },
    children: []
  }, targetSourceNodeId, 0, browser);
};

export const persistInsertText = (style: any, nodeValue: string, targetSourceNodeId: string, browser: SyntheticBrowser) => {
  return persistInsertNode({
    name: "text",
    attributes: {
      [DEFAULT_NAMESPACE]: {
        style,
        value: nodeValue
      }
    },
    children: []
  }, targetSourceNodeId, 0, browser);
};


// TODO - documentId needs to be nodeId
export const persistInsertNode = (child: TreeNode, refSourceNodeId: string, offset: 0 | -1 | 1, browser: SyntheticBrowser) => {
  const sourceRefNode = getSourceNodeById(refSourceNodeId, browser);
  const dep = getSourceNodeDependency(refSourceNodeId, browser);
  const sourceParentNode = offset === 0 ? sourceRefNode : getParentTreeNode(sourceRefNode.id, dep.content);
  const index = offset === 0 ? sourceParentNode.children.length : sourceParentNode.children.indexOf(sourceRefNode) + (offset === -1 ? 0 : 1);

  return updateDependencyAndRevaluate({
    content: insertComponentChildNode(addTreeNodeIds(child, dep.content.id), index, sourceParentNode.id, dep.content)
  }, dep.uri, browser);
};

const insertComponentChildNode = (child: TreeNode, index: number, parentId: string, content: TreeNode) => {
  const parentNode = getNestedTreeNodeById(parentId, content);

  const isComponent = parentNode.name === "component";
  const isChildComponent = Boolean(getAttribute(parentNode, "extends"));
  // don't allow for this kind of thing
  if (isChildComponent) {
    throw new Error(`Cannot insert node into child component`);
  }
  const parent = isComponent ? parentNode.children.find(child => child.name === "template") : parentNode;

  let newContent: TreeNode = content;
  newContent = updateNestedNode(parent, newContent, (parent) => {
    return {
      ...parent,
      children: arraySplice(parent.children, index, 0, child)
    };
  });
  return newContent;
};

export const persistDeleteSyntheticItems = (nodeIds: string[], browser: SyntheticBrowser) => {
  return nodeIds.reduce((state, nodeId) => {
    const syntheticNode = getSyntheticNodeById(nodeId, browser);
    const dep = browser.graph[syntheticNode.source.uri];
    const sourceNode = getSyntheticSourceNode(syntheticNode.id, browser);
    return updateDependencyAndRevaluate({
      content: removeNestedTreeNode(sourceNode, dep.content)
    }, dep.uri, state);
  }, browser);
};

export const persistMoveSyntheticNode = (node: SyntheticNode, targetNodeId: string, offset: 0 | -1 |  1, browser: SyntheticBrowser) => {
  const document = getSyntheticNodeDocument(node.id, browser);
  const parent = getParentTreeNode(node.id, document.root);
  const sourceNode = getSyntheticSourceNode(node.id, browser);
  const targetSourceNode = getSyntheticSourceNode(targetNodeId, browser);
  browser = persistSyntheticNodeChanges(parent.id, browser, parent => {
    return removeNestedTreeNode(sourceNode, parent);
  });

  // TODO - point to target node id
  browser = persistInsertNode(sourceNode, targetSourceNode.id, offset, browser);
  return browser;
};

export const persistSyntheticItemPosition = (position: Point, nodeId: string, browser: SyntheticBrowser) => {
  const bounds = getSyntheticNodeBounds(nodeId, browser);
  return persistSyntheticItemBounds(moveBounds(bounds, position), nodeId, browser);
};

export const getModifiedDependencies = (oldGraph: DependencyGraph, newGraph: DependencyGraph): Dependency[] => {
  return pull(Object.values(newGraph), ...(Object.values(oldGraph) as any));
};

export const persistSyntheticItemBounds = (bounds: Bounds, nodeId: string, browser: SyntheticBrowser) => {
  if (isSyntheticDocumentRoot(nodeId, browser)) {
    return persistSyntheticNodeChanges(nodeId, browser, (child) => {
      return setNodeAttribute(child, "bounds", bounds, EDITOR_NAMESPACE);
    });
  } else {
    const document = getSyntheticNodeDocument(nodeId, browser);
    return persistSyntheticNodeChanges(nodeId, browser, (child) => {
      const style = getAttribute(child, "style") || EMPTY_OBJECT;
      const pos = style.position || "relative";
      return setNodeAttribute(child, "style", {
        ...style,
        position: pos,
        left: bounds.left - document.bounds.left,
        top: bounds.top - document.bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
      });
    });
  }
};

export const persistRawCSSText = (text: string, nodeId: string, browser: SyntheticBrowser) => {
  const newStyle = parseStyle(text);
  return persistSyntheticNodeChanges(nodeId, browser, (child) => {
    const style = getAttribute(child, "style") || EMPTY_OBJECT;
    return setNodeAttribute(child, "style", newStyle);
  });
};