import { TreeNodeAttributes, getTeeNodePath, generateTreeChecksum, getTreeNodeFromPath, getAttribute, getNestedTreeNodeById, getTreeNodeIdMap, DEFAULT_NAMESPACE, updateNestedNode, setNodeAttribute, findNodeByTagName, TreeNode, TreeNodeUpdater, findNestedNode, addTreeNodeIds, removeNestedTreeNode } from "../common/state/tree";
import { arraySplice, generateId, parseStyle, memoize, EMPTY_ARRAY, EMPTY_OBJECT, stringifyTreeNodeToXML } from "../common/utils";
import { DependencyGraph, Dependency, getModuleInfo, getComponentInfo, getNodeSourceDependency, updateGraphDependency, getDependents, SetAttributeOverride, getNodeSourceModule, getNodeSourceComponent } from "./dsl";
import { renderDOM, patchDOM, computeDisplayInfo } from "./dom-renderer";
import { Bounds, Struct, shiftBounds, StructReference, Point, getBoundsSize, pointIntersectsBounds, moveBounds, boundsFromRect } from "../common";
import { mapValues, pull } from "lodash";
import { createSetAttributeTransform, OperationalTransform, diffNode, patchNode, OperationalTransformType, SetAttributeTransform } from "../common/utils/tree";
import { evaluateDependencyEntry, evaluateComponent } from "./evaluate";
import { STATUS_CODES } from "http";
import { Children } from "react";

const PREVIEW_NAMESPACE = "preview";
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
  container.addEventListener('load', () => {
    Object.assign(container.contentDocument.body.style, {
      padding: 0,
      margin: 0
    });
  });

  const bounds = getAttribute(component, "bounds", "preview");

  const syntheticDocument: SyntheticDocument = {
    root,
    container,
    bounds: typeof bounds === "string" ? mapValues(parseStyle(bounds), Number) as Bounds : bounds,
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

export const getSyntheticNodeSourceNode = (synthetic: SyntheticNode, graph: DependencyGraph) => {
  return getTreeNodeFromPath(synthetic.source.path, graph[synthetic.source.uri].content);
}

export const getSyntheticWindowDependency = (window: SyntheticWindow, graph: DependencyGraph) => graph && graph[window.location];
export const getSyntheticDocumentDependency = (documentId: string, browser: SyntheticBrowser) => getSyntheticWindowDependency(getSyntheticDocumentWindow(documentId, browser), browser.graph);

export const getSyntheticDocumentComponent = (document: SyntheticDocument, graph: DependencyGraph) =>  getComponentInfo(getSyntheticNodeSourceNode(document.root, graph));

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

export const getSyntheticItemBounds = memoize((value: Struct, browser: SyntheticBrowser) => {
  if (!value) {
    return null;
  }
  if ((value as SyntheticDocument).type === SyntheticObjectType.DOCUMENT) {
    return getSyntheticDocumentById(value.id, browser).bounds;
  } else {

    const document = getSyntheticNodeDocument(value.id, browser);
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
  const nativeNodeMap = patchDOM(transforms, document.root, document.container.contentDocument.body.children[0] as HTMLElement, document.nativeNodeMap);
  return updateSyntheticDocument({
    computed: computeDisplayInfo(nativeNodeMap),
    nativeNodeMap
  }, document.id, browser);
};


const updateSyntheticItem = <TItem>(properties: Partial<TItem>, ref: StructReference<any>, browser: SyntheticBrowser) => {
  if (ref.type === SyntheticObjectType.DOCUMENT) {
    const document = getSyntheticDocumentById(ref.id, browser);
    throw new Error("TODO - modify document, and source");
  }
  const document = getSyntheticNodeDocument(ref.id, browser);
  const item = getNestedTreeNodeById(ref.id, document.root) as SyntheticNode;
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
  return getNestedTreeNodeById(nodeId, document.root) as SyntheticNode;
};

export const getSyntheticNodeSourceComponent = memoize((nodeId: string, browser: SyntheticBrowser) => {
  const document = getSyntheticNodeDocument(nodeId, browser);
  const componentNode = getSyntheticNodeSourceNode(document.root, browser.graph);
  if (!componentNode) {
    return null;
  }
  return getComponentInfo(componentNode);
});

export const updateSyntheticItemPosition = (position: Point, ref: StructReference<any>, browser: SyntheticBrowser) => {
  const bounds = getSyntheticItemBounds(ref, browser);
  return updateSyntheticItemBounds(moveBounds(bounds, position), ref, browser, PersistBoundsFilter.POSITION);
};

enum PersistBoundsFilter {
  WIDTH = 1,
  HEIGHT = 1 << 1,
  POSITION = 1 << 2
};

export const updateSyntheticItemBounds = (bounds: Bounds, ref: StructReference<any>, browser: SyntheticBrowser, filter: PersistBoundsFilter = PersistBoundsFilter.HEIGHT | PersistBoundsFilter.POSITION | PersistBoundsFilter.WIDTH) => {
  if (ref.type === SyntheticObjectType.DOCUMENT) {
    return updateSyntheticDocument({
      bounds,
    }, ref.id, browser);
  } else {
    const node = getSyntheticNodeById(ref.id, browser);
    const document = getSyntheticNodeDocument(ref.id, browser);
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

    return updateSyntheticNodeStyle(newStyle, ref, browser);
  }
};

export const persistPasteSyntheticNodes = (dependencyUri: string, sourceNodeId: string, syntheticNodes: SyntheticNode[], browser: SyntheticBrowser) => {
  const targetDep = browser.graph[dependencyUri];
  const targetSourceNode = getNestedTreeNodeById(sourceNodeId, targetDep.content);

  const newContent = syntheticNodes.reduce((content, syntheticNode) => {
    const sourceDep = browser.graph[syntheticNode.source.uri];
    const sourceNode = getSyntheticNodeSourceNode(syntheticNode, browser.graph);

    // If there is NO source node, then possibly create a detached node and add to target component
    if (!sourceNode) {
      throw new Error("not implemented");
    }

    // is component
    if (syntheticNode.source.path.length === 1) {

      // TODO - need to possibly import import component
      if (syntheticNode.source.uri !== targetDep.uri) {
        throw new Error("NOT IMPLEMENTED YET");
      }


      const childComponentNode = createComponentNode(
        targetDep,
        shiftBounds(getAttribute(sourceNode, "bounds", PREVIEW_NAMESPACE), PASTED_ARTBOARD_OFFSET),
        getAttribute(sourceNode, "id")
      );

      return {
        ...content,
        children: [
          ...content.children,
          childComponentNode
        ]
      }
    }
    return content;
  }, targetDep.content);

  return updateDependencyAndRevaluate({
    content: newContent
  }, targetDep.uri, browser);
}

export const getSyntheticDocumentById = memoize((documentId: string, state: SyntheticWindow|SyntheticBrowser) => findSyntheticDocument(state, document => document.id === documentId));

export const getSyntheticNodeDocument = memoize((nodeId: string, state: SyntheticBrowser|SyntheticWindow): SyntheticDocument => findSyntheticDocument(state, document => {
  return Boolean(getNestedTreeNodeById(nodeId, document.root));
}));

const persistSyntheticNodeChanges = (ref: StructReference<any>, browser: SyntheticBrowser, updater: TreeNodeUpdater) => {

  const syntheticDocument = ref.type === SyntheticObjectType.DOCUMENT ? getSyntheticDocumentById(ref.id, browser) : getSyntheticNodeDocument(ref.id, browser);
  const syntheticNode = ref.type === SyntheticObjectType.DOCUMENT ? syntheticDocument.root : getSyntheticNodeById(ref.id, browser);

  const sourceNode = getSyntheticNodeSourceNode(syntheticNode, browser.graph);
  const sourceDependency = browser.graph[syntheticNode.source.uri];
  const sourceComponent = ref.type === SyntheticObjectType.DOCUMENT ? getSyntheticDocumentComponent(syntheticDocument, browser.graph) : getSyntheticNodeSourceComponent(ref.id, browser);

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
      const overrides = findNodeByTagName(sourceComponent.source, "overrides");

      const targetName = getAttribute(sourceNode, "ref");
      for (const ot of ots) {
        switch(ot.type) {
          case OperationalTransformType.SET_ATTRIBUTE: {
            const { name, value, namespace } = ot as SetAttributeTransform;
            if (name === "style" && namespace === DEFAULT_NAMESPACE) {
              for (const key in value) {
                const existingStyleOverride = findNestedNode(overrides, (node) => node.name === "set-style" && getAttribute(node, "name") === key && getAttribute(node, "target") === targetName);
                if (existingStyleOverride) {
                  updatedModuleSourceNode = updateNestedNode(existingStyleOverride, updatedModuleSourceNode, (child) => {
                    return {
                      ...child,
                      attributes: {
                        ...child.attributes,
                        [DEFAULT_NAMESPACE]: {
                          ...(child.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT),
                          value: value[key]
                        }
                      }
                    }
                  });
                } else {
                  overrideChildren.push({
                    name: "set-style",
                    id: overrides.id + "set-style" + key,
                    attributes: {
                      [DEFAULT_NAMESPACE]: {
                        name: key,
                        value: value[key],
                        target: targetName,
                      }
                    },
                    children: []
                  });
                }
              }
            }
          }
        }
      }

      if (ots.length) {
        updatedModuleSourceNode = updateNestedNode(overrides, updatedModuleSourceNode, (child) => {
          return {
            ...child,
            children: [
              ...child.children,
              ...overrideChildren
            ]
          }
        });
      }
    }

    return updateDependencyAndRevaluate({
      content: updatedModuleSourceNode
    }, sourceDependency.uri, browser);
};

const updateDependencyAndRevaluate = (properties: Partial<Dependency>, dependencyUri: string, browser: SyntheticBrowser) => {

  const oldGraph = browser.graph;
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
        const sourceComponent = getComponentInfo(getSyntheticNodeSourceNode(newDocumentNode, graph));
        const document = window.documents.find(document => {
          const documentComponent = getSyntheticDocumentComponent(document, oldGraph);
          return getAttribute(documentComponent.source, "id") === getAttribute(sourceComponent.source, "id")
        });
        if (!document) {
          const newDocument = createSyntheticDocument(newDocumentNode, graph);
          return newDocument;
        }
        const ots = diffNode(document.root, newDocumentNode);
        const newRoot = copyTreeSources(patchNode(ots, document.root), newDocumentNode);
        const nativeNodeMap = patchDOM(ots, document.root, document.container.contentDocument.body.children[0] as HTMLElement, document.nativeNodeMap);
        return {
          ...document,
          nativeNodeMap,
          computed: computeDisplayInfo(nativeNodeMap),
          root: newRoot
        }
      })
    }, browser);
  }

  return browser;
};

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
      [PREVIEW_NAMESPACE]: {
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

export const persistInsertRectangle = (style: any, documentId: string, browser: SyntheticBrowser) => {
  return persistInsertNode({
    name: "div",
    attributes: {
      [DEFAULT_NAMESPACE]: {
        style
      }
    },
    children: []
  }, documentId, browser);
};

export const persistInsertText = (style: any, nodeValue: string, documentId: string, browser: SyntheticBrowser) => {
  return persistInsertNode({
    name: "text",
    attributes: {
      [DEFAULT_NAMESPACE]: {
        style,
        value: nodeValue
      }
    },
    children: []
  }, documentId, browser);
};


export const persistInsertNode = (child: TreeNode, documentId: string, browser: SyntheticBrowser) => {
  const dep = getSyntheticDocumentDependency(documentId, browser);
  const componentNode = getSyntheticDocumentComponent(getSyntheticDocumentById(documentId, browser), browser.graph).source;
  const isChildComponent = Boolean(getAttribute(componentNode, "extends"));
  return updateDependencyAndRevaluate({
    content: insertComponentChildNode(componentNode.id, addTreeNodeIds(child, dep.content.id), dep.content)
  }, dep.uri, browser);
};
const insertComponentChildNode = (componentId: string, child: TreeNode, content: TreeNode) => {
  const componentNode = getNestedTreeNodeById(componentId, content);
  const isChildComponent = Boolean(getAttribute(componentNode, "extends"));

  let newContent: TreeNode = content;

  if (isChildComponent) {
    let overrides = componentNode.children.find(child => child.name === "overrides");
    if (!overrides) {
      overrides = addTreeNodeIds({
        name: "overrides",
        attributes: {
        },
        children: []
      }, child.id);
      newContent = updateNestedNode(componentNode, newContent, (component) => ({
        ...component,
        children: [
          ...component.children,
          overrides
        ]
      }));
    }

    newContent = updateNestedNode(overrides, newContent, (overrides) => ({
      ...overrides,
      children: [
        ...overrides.children,
        addTreeNodeIds({
          name: "insert-child",
          attributes: {},
          children: [child]
        }, generateTreeChecksum(newContent))
      ]
    }));
  } else {

    const template = componentNode.children.find(child => child.name === "template");
    newContent = updateNestedNode(template, newContent, (template) => {
      return {
        ...template,
        children: [
          ...template.children,
          child
        ]
      };
    });
  }
  return newContent;
};

export const persistDeleteSyntheticItems = (refs: StructReference<any>[], browser: SyntheticBrowser) => {
  return refs.reduce((state, ref) => {
    let document: SyntheticDocument;
    let dep: Dependency;
    let sourceNode: TreeNode;
    if (ref.type === SyntheticObjectType.DOCUMENT) {
      document = getSyntheticDocumentById(ref.id, browser);
      dep = getSyntheticDocumentDependency(ref.id, browser);
      const component = getSyntheticDocumentComponent(document, browser.graph);
      sourceNode = component.source;
    } else {
      const syntheticNode = getSyntheticNodeById(ref.id, browser);
      document= getSyntheticNodeDocument(ref.id, browser);
      dep = browser.graph[syntheticNode.source.uri];
      sourceNode = getSyntheticNodeSourceNode(syntheticNode, browser.graph);
    }
    return updateDependencyAndRevaluate({
      content: removeNestedTreeNode(sourceNode, dep.content)
    }, dep.uri, state);
  }, browser);
};

export const persistSyntheticItemPosition = (position: Point, ref: StructReference<any>, browser: SyntheticBrowser) => {
  const bounds = getSyntheticItemBounds(ref, browser);
  return persistSyntheticItemBounds(moveBounds(bounds, position), ref, browser);
};

export const getModifiedDependencies = (oldGraph: DependencyGraph, newGraph: DependencyGraph): Dependency[] => {
  return pull(Object.values(newGraph), ...(Object.values(oldGraph) as any));
};

export const persistSyntheticItemBounds = (bounds: Bounds, ref: StructReference<any>, browser: SyntheticBrowser) => {
  if (ref.type === SyntheticObjectType.DOCUMENT) {
    return persistSyntheticNodeChanges(ref, browser, (child) => {
      return setNodeAttribute(child, "bounds", bounds, PREVIEW_NAMESPACE);
    });
  } else {
    const document = getSyntheticNodeDocument(ref.id, browser);
    return persistSyntheticNodeChanges(ref, browser, (child) => {
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