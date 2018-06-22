import {
  KeyValue,
  generateUID,
  EMPTY_ARRAY,
  TreeNodeUpdater,
  EMPTY_OBJECT,
  getNestedTreeNodeById,
  memoize,
  TreeNode,
  Bounds,
  updateNestedNode,
  shiftBounds,
  Point,
  findTreeNodeParent,
  diffArray,
  patchArray,
  arraySplice
} from "tandem-common";
import * as crc32 from "crc32";
import { DependencyGraph, Dependency } from "./graph";
import {
  PCNode,
  getPCNode,
  PCVisibleNode,
  getPCNodeContentNode,
  getPCNodeDependency,
  PCSourceTagNames,
  getPCImportedChildrenSourceUris,
  PCTextNode,
  PCElement,
  PCOverride,
  validatePCModule,
  PCComponent
} from "./dsl";
import { diffTreeNode, patchTreeNode } from "./ot";

/*------------------------------------------
 * STATE
 *-----------------------------------------*/

export type SyntheticSource = {
  nodeId: string;
};

export const SYNTHETIC_DOCUMENT_NODE_NAME = "document";

export type SyntheticBaseNode = {
  metadata: KeyValue<any>;
  source: SyntheticSource;

  // TODO - this information should go in metadata
  isContentNode?: boolean;
  isCreatedFromComponent?: boolean;
  immutable?: boolean;
  isComponentInstance?: boolean;
  label?: string;
} & TreeNode<string>;

export type SyntheticDocument = {
  checksum?: string;
  children: SyntheticVisibleNode[];
} & SyntheticBaseNode;

export type SyntheticElement = {
  attributes: KeyValue<string>;
  style: KeyValue<any>;
  children: Array<SyntheticVisibleNode | PCOverride>;
} & SyntheticBaseNode;

export type SyntheticTextNode = {
  value: string;
  style: KeyValue<any>;
  children: Array<PCOverride>;
} & SyntheticBaseNode;

export type SyntheticVisibleNode = SyntheticElement | SyntheticTextNode;
export type SyntheticNode = SyntheticDocument | SyntheticVisibleNode;
export type SyntheticContentNode = SyntheticVisibleNode;

/*------------------------------------------
 * STATE FACTORIES
 *-----------------------------------------*/

export const createSytheticDocument = (
  source: SyntheticSource,
  children?: SyntheticVisibleNode[],
): SyntheticDocument => ({
  id: generateUID(),
  metadata: EMPTY_OBJECT,
  source,
  name: SYNTHETIC_DOCUMENT_NODE_NAME,
  children: children || EMPTY_ARRAY
});

export const setDocumentChecksum = (document: SyntheticDocument): SyntheticDocument => {
  const newChecksum = generateSyntheticDocumentChecksum(document);
  if (document.checksum === newChecksum) {
    return document;
  }
  return {
    ...document,
    checksum: newChecksum
  };
}

export const createSyntheticElement = (
  name: string,
  source: SyntheticSource,
  style: KeyValue<any> = EMPTY_OBJECT,
  attributes: KeyValue<string> = EMPTY_OBJECT,
  children: SyntheticVisibleNode[] = EMPTY_ARRAY,
  label?: string,
  isContentNode?: boolean,
  isCreatedFromComponent?: boolean,
  isComponentInstance?: boolean,
  immutable?: boolean,
  metadata?: KeyValue<any>
): SyntheticElement => ({
  id: generateUID(),
  metadata: metadata || EMPTY_OBJECT,
  label,
  isComponentInstance,
  isCreatedFromComponent,
  isContentNode,
  immutable,
  source,
  name,
  attributes: attributes || EMPTY_OBJECT,
  style: style || EMPTY_OBJECT,
  children: children || EMPTY_ARRAY
});

export const createSyntheticTextNode = (
  value: string,
  source: SyntheticSource,
  style: KeyValue<any> = EMPTY_OBJECT,
  label?: string,
  isContentNode?: boolean,
  isCreatedFromComponent?: boolean,
  immutable?: boolean,
  metadata?: KeyValue<any>
): SyntheticTextNode => ({
  label,
  id: generateUID(),
  metadata: metadata || EMPTY_OBJECT,
  value,
  isContentNode,
  isCreatedFromComponent,
  immutable,
  source,
  name: PCSourceTagNames.TEXT,
  style,
  children: EMPTY_ARRAY
});

/*------------------------------------------
 * TYPE UTILS
 *-----------------------------------------*/

export const isPaperclipState = (state: any) => Boolean(state.frames);

export const isSyntheticVisibleNodeRoot = (
  node: SyntheticVisibleNode,
  graph: DependencyGraph
) => getSyntheticSourceFrame(node, graph).children[0].id === node.source.nodeId;

export const isSyntheticDocumentRoot = (node: SyntheticVisibleNode) => {
  return node.isContentNode;
};

export const isSyntheticDocument = (node: SyntheticNode): node is SyntheticDocument => {
  return node.name === SYNTHETIC_DOCUMENT_NODE_NAME;
};

export const isSyntheticElement = (node: SyntheticNode): node is SyntheticElement => {
  return Boolean((node as SyntheticElement).attributes);
};

export const isSyntheticTextNode = (node: SyntheticNode): node is SyntheticTextNode => {
  return (node as SyntheticTextNode).name === PCSourceTagNames.TEXT;
};

export const isSyntheticVisibleNode = (
  node: any
): node is SyntheticVisibleNode => {
  const sn = node as SyntheticVisibleNode;
  if (!sn) return false;
  return Boolean(sn.source.nodeId) && Boolean(sn.name);
};

export const isSyntheticVisibleNodeMovable = (node: SyntheticVisibleNode) =>
  isSyntheticDocumentRoot(node) ||
  /fixed|relative|absolute/.test(node.style.position || "static");

export const isSyntheticVisibleNodeResizable = (node: SyntheticVisibleNode) =>
  isSyntheticDocumentRoot(node) ||
  isSyntheticVisibleNodeMovable(node) ||
  /block|inline-block|flex|inline-flex/.test(node.style.display || "inline");

/*------------------------------------------
 * GETTERS
 *-----------------------------------------*/

export const getSyntheticSourceNode = (
  node: SyntheticVisibleNode | SyntheticDocument,
  graph: DependencyGraph
) => getPCNode(node.source.nodeId, graph) as PCVisibleNode | PCComponent;

export const getSyntheticSourceFrame = (
  node: SyntheticVisibleNode,
  graph: DependencyGraph
) =>
  getPCNodeContentNode(
    node.source.nodeId,
    getPCNodeDependency(node.source.nodeId, graph).content
  );

export const getSyntheticDocumentByDependencyUri = memoize(
  (
    uri: string,
    documents: SyntheticDocument[],
    graph: DependencyGraph
  ): SyntheticDocument => {
    return documents.find((document: SyntheticDocument) => {
      return getPCNodeDependency(document.source.nodeId, graph).uri === uri;
    });
  }
);

export const getSyntheticDocumentDependencyUri = (
  document: SyntheticDocument,
  graph: DependencyGraph
) => {
  return getPCNodeDependency(document.source.nodeId, graph).uri;
};

export const getSyntheticVisibleNodeDocument = memoize(
  (
    syntheticNodeId: string,
    syntheticDocuments: SyntheticDocument[]
  ): SyntheticDocument => {
    return syntheticDocuments.find(document => {
      return getNestedTreeNodeById(syntheticNodeId, document);
    });
  }
);

export const getSyntheticSourceUri = (
  syntheticNode: SyntheticVisibleNode,
  graph: DependencyGraph
) => {
  return getPCNodeDependency(syntheticNode.source.nodeId, graph).uri;
};

export const getSyntheticNodeById = memoize(
  (
    syntheticNodeId: string,
    documents: SyntheticDocument[]
  ): SyntheticVisibleNode => {
    const document = getSyntheticVisibleNodeDocument(
      syntheticNodeId,
      documents
    );
    if (!document) {
      return null;
    }
    return getNestedTreeNodeById(syntheticNodeId, document);
  }
);

export const getSyntheticNodeSourceDependency = (
  node: SyntheticVisibleNode | SyntheticDocument,
  graph: DependencyGraph
) => getPCNodeDependency(node.source.nodeId, graph);

export const findRootInstanceOfPCNode = memoize(
  (node: PCVisibleNode, documents: SyntheticDocument[]) => {
    for (const document of documents) {
      for (const contentNode of document.children) {
        if (contentNode.source.nodeId === node.id) {
          return contentNode;
        }
      }
    }
    return null;
  }
);

export const findClosestParentComponentInstance = memoize(
  (
    node: SyntheticVisibleNode,
    root: SyntheticVisibleNode | SyntheticDocument
  ) => {
    return findTreeNodeParent(node.id, root, isComponentOrInstance);
  }
);

export const findFurthestParentComponentInstance = memoize(
  (
    node: SyntheticVisibleNode,
    root: SyntheticVisibleNode | SyntheticDocument
  ) => {
    const parentComponentInstances = getAllParentComponentInstance(node, root);
    return parentComponentInstances.length
      ? parentComponentInstances[parentComponentInstances.length - 1]
      : null;
  }
);

export const getAllParentComponentInstance = memoize(
  (
    node: SyntheticVisibleNode,
    root: SyntheticVisibleNode | SyntheticDocument
  ) => {
    let current = findClosestParentComponentInstance(node, root);
    if (!current) return [];
    const instances = [current];
    while (current) {
      const parent = findClosestParentComponentInstance(current, root);
      if (!parent) break;
      current = parent;

      instances.push(current);
    }

    return instances;
  }
);

export const isComponentOrInstance = (node: SyntheticVisibleNode) =>
  node.isComponentInstance ||
  (node.isContentNode && node.isCreatedFromComponent);

export const getNearestComponentInstances = memoize(
  (
    node: SyntheticVisibleNode,
    root: SyntheticVisibleNode | SyntheticDocument
  ) => {
    const instances = getAllParentComponentInstance(node, root);
    if (isComponentOrInstance(node)) {
      return [node, ...instances];
    }
    return instances;
  }
);

export const generateSyntheticDocumentChecksum = memoize((document: SyntheticDocument) => {
  return getPCNodePreChecksum(document);
});

const getPCNodePreChecksum = memoize((node: SyntheticNode) => {
  return crc32(getShallowPCNodePreChecksum(node) + node.children.map(getPCNodePreChecksum).join(""));
});

const getShallowPCNodePreChecksum = (node: SyntheticNode) => {
  const base = node.name + node.label + node.source.nodeId + node.immutable + node.isComponentInstance + node.isContentNode + node.isCreatedFromComponent;
  if (isSyntheticDocument(node)) {
    return base;
  } else if (isSyntheticElement(node)) {
    return base + JSON.stringify(node.attributes) + JSON.stringify(node.style);
  } else if (isSyntheticTextNode(node)) {
    return base + node.value;
  } else {
    throw new Error(`unsupported synthetic node`);
  }
};

/*------------------------------------------
 * SETTERS
 *-----------------------------------------*/

export const upsertSyntheticDocument = (
  newDocument: SyntheticDocument,
  oldDocuments: SyntheticDocument[],
  graph: DependencyGraph
) => {
  const oldDocumentIndex = oldDocuments.findIndex(
    oldDocument => oldDocument.source.nodeId === newDocument.source.nodeId
  );
  if (oldDocumentIndex === -1) {
    return [...oldDocuments, newDocument];
  }
  const oldDocument = oldDocuments[oldDocumentIndex];
  return arraySplice(
    oldDocuments,
    oldDocumentIndex,
    1,
    patchTreeNode(diffTreeNode(oldDocument, newDocument), oldDocument)
  );
};

export const updateSyntheticVisibleNodeMetadata = (
  metadata: KeyValue<any>,
  node: SyntheticVisibleNode,
  document: SyntheticDocument
) =>
  updateNestedNode(node, document, node => ({
    ...node,
    metadata: {
      ...node.metadata,
      ...metadata
    }
  }));
