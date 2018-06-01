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
  findTreeNodeParent
} from "tandem-common";
import { values } from "lodash";
import { DependencyGraph, Dependency } from "./graph";
import {
  PCNode,
  getPCNode,
  PCVisibleNode,
  getPCNodeFrame,
  getPCNodeDependency,
  PCSourceTagNames,
  getPCImportedChildrenSourceUris,
  PCTextNode,
  PCElement
} from "./dsl";
import { diffSyntheticNode, patchSyntheticNode } from "./ot";

/*------------------------------------------
 * CONSTANTS
 *-----------------------------------------*/

const NO_BOUNDS = { left: 0, top: 0, right: 0, bottom: 0 };

/*------------------------------------------
 * STATE
 *-----------------------------------------*/

export type ComputedDisplayInfo = {
  [identifier: string]: {
    bounds: Bounds;
    style: CSSStyleDeclaration;
  };
};

export type PCNodeClip = {
  uri: string;
  node: PCNode;
  fixedBounds: Bounds;
};

export type SyntheticFrames = KeyValue<SyntheticFrame>;

export type SyntheticSource = {
  nodeId: string;
};

export type SyntheticFrame = {
  root: SyntheticNode;
  source: SyntheticSource;
  bounds: Bounds;

  // internal only
  $container?: HTMLElement;
  computed?: ComputedDisplayInfo;
};

export type SyntheticBaseNode = {
  metadata: KeyValue<any>;
  source: SyntheticSource;
  isRoot?: boolean;
  isCreatedFromComponent?: boolean;
  isComponentInstance?: boolean;
  label?: string;
} & TreeNode<string>;

export type SyntheticElement = {
  attributes: KeyValue<string>;
  style: KeyValue<any>;
} & SyntheticBaseNode;

export type SyntheticTextNode = {
  value: string;
  style: KeyValue<any>;
} & SyntheticBaseNode;

export type SyntheticNode = SyntheticElement | SyntheticTextNode;

/*------------------------------------------
 * STATE FACTORIES
 *-----------------------------------------*/

export const createSyntheticElement = (
  name: string,
  source: SyntheticSource,
  style: KeyValue<any> = {},
  attributes: KeyValue<string>,
  children: SyntheticNode[] = EMPTY_ARRAY,
  label?: string,
  isRoot?: boolean,
  isCreatedFromComponent?: boolean,
  isComponentInstance?: boolean
): SyntheticElement => ({
  id: generateUID(),
  metadata: EMPTY_OBJECT,
  label,
  isComponentInstance,
  isCreatedFromComponent,
  isRoot,
  source,
  name,
  attributes,
  style,
  children
});

export const createSyntheticTextNode = (
  value: string,
  source: SyntheticSource,
  style: KeyValue<any> = EMPTY_OBJECT,
  label?: string,
  isRoot?: boolean,
  isCreatedFromComponent?: boolean
): SyntheticTextNode => ({
  label,
  id: generateUID(),
  metadata: EMPTY_OBJECT,
  value,
  isRoot,
  isCreatedFromComponent,
  source,
  name: PCSourceTagNames.TEXT,
  style,
  children: EMPTY_ARRAY
});

/*------------------------------------------
 * TYPE UTILS
 *-----------------------------------------*/

export const isPaperclipState = (state: any) => Boolean(state.syntheticFrames);

export const isSyntheticNodeRoot = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getSyntheticSourceFrame(node, graph).children[0].id === node.source.nodeId;

export const isSyntheticDocumentRoot = (node: SyntheticNode) => {
  return node.isRoot;
};

export const isSyntheticNodeMovable = (node: SyntheticNode) =>
  isSyntheticDocumentRoot(node) ||
  /fixed|relative|absolute/.test(node.style.position || "static");

export const isSyntheticNodeResizable = (node: SyntheticNode) =>
  isSyntheticDocumentRoot(node) ||
  isSyntheticNodeMovable(node) ||
  /block|inline-block|flex|inline-flex/.test(node.style.display || "inline");

/*------------------------------------------
 * GETTERS
 *-----------------------------------------*/

export const getSyntheticSourceNode = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getPCNode(node.source.nodeId, graph) as PCVisibleNode;

export const getSyntheticSourceFrame = (
  node: SyntheticNode,
  graph: DependencyGraph
) =>
  getPCNodeFrame(
    node.source.nodeId,
    getPCNodeDependency(node.source.nodeId, graph).content
  );

export const getSyntheticFramesByDependencyUri = memoize(
  (
    uri: string,
    frames: SyntheticFrames,
    graph: DependencyGraph
  ): SyntheticFrame[] => {
    return values(frames).filter((frame: SyntheticFrame) => {
      return getPCNodeDependency(frame.source.nodeId, graph).uri === uri;
    });
  }
);

export const getSyntheticFrameDependencyUri = (
  frame: SyntheticFrame,
  graph: DependencyGraph
) => {
  return getPCNodeDependency(frame.root.source.nodeId, graph).uri;
};

export const getSyntheticNodeFrame = memoize(
  (
    syntheticNodeId: string,
    syntheticFrames: SyntheticFrames
  ): SyntheticFrame => {
    for (const sourceFrameId in syntheticFrames) {
      const frame = syntheticFrames[sourceFrameId];
      if (getNestedTreeNodeById(syntheticNodeId, frame.root)) {
        return frame;
      }
    }
    return null;
  }
);

export const getSyntheticSourceUri = (
  syntheticNode: SyntheticNode,
  graph: DependencyGraph
) => {
  return getPCNodeDependency(syntheticNode.source.nodeId, graph).uri;
};

export const getSyntheticNodeById = memoize(
  (
    syntheticNodeId: string,
    syntheticFrames: SyntheticFrames
  ): SyntheticNode => {
    return getNestedTreeNodeById(
      syntheticNodeId,
      getSyntheticNodeFrame(syntheticNodeId, syntheticFrames).root
    );
  }
);

export const getSyntheticNodeComputedBounds = (
  syntheticNodeId: string,
  frame: SyntheticFrame
) => {
  return (
    (frame.computed &&
      frame.computed[syntheticNodeId] &&
      frame.computed[syntheticNodeId].bounds) ||
    NO_BOUNDS
  );
};

export const getSyntheticNodeSourceDependency = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getPCNodeDependency(node.source.nodeId, graph);

export const getSyntheticNodeRelativeBounds = memoize(
  (syntheticNodeId: string, frames: SyntheticFrames): Bounds => {
    const frame = getSyntheticNodeFrame(syntheticNodeId, frames);
    return shiftBounds(
      getSyntheticNodeComputedBounds(syntheticNodeId, frame),
      frame.bounds
    );
  }
);

export const getSyntheticNodeFixedBounds = memoize(
  (syntheticNodeId: string, frames: SyntheticFrames): Bounds => {
    const frame = getSyntheticNodeFrame(syntheticNodeId, frames);
    return shiftBounds(
      getSyntheticNodeRelativeBounds(syntheticNodeId, frames),
      frame.bounds
    );
  }
);

export const findRootInstanceOfPCNode = (
  node: PCVisibleNode,
  allFrames: SyntheticFrames
) => {
  const frame = values(allFrames).find(
    frame => frame.root.source.nodeId === node.id
  );
  return frame && frame.root;
};

export const getPCNodeClip = (
  node: SyntheticNode,
  frames: SyntheticFrames,
  graph: DependencyGraph
): PCNodeClip => {
  const sourceNode = getSyntheticSourceNode(node, graph);
  const frame = getSyntheticNodeFrame(node.id, frames);
  return {
    uri: getSyntheticSourceUri(node, graph),
    node: sourceNode,
    fixedBounds: node.isRoot
      ? frame.bounds
      : getSyntheticNodeRelativeBounds(node.id, frames)
  };
};

export const findClosestParentComponentInstance = memoize(
  (node: SyntheticNode, root: SyntheticNode) => {
    return findTreeNodeParent(
      node.id,
      root,
      (parent: SyntheticNode) => parent.isComponentInstance
    );
  }
);

export const findFurthestParentComponentInstance = memoize(
  (node: SyntheticNode, root: SyntheticNode) => {
    const parentComponentInstances = getAllParentComponentInstance(node, root);
    return parentComponentInstances.length
      ? parentComponentInstances[parentComponentInstances.length - 1]
      : null;
  }
);

export const getAllParentComponentInstance = memoize(
  (node: SyntheticNode, root: SyntheticNode) => {
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

/*------------------------------------------
 * SETTERS
 *-----------------------------------------*/

export const updateSyntheticFrames = (
  oldFrames: SyntheticFrames,
  newFrames: SyntheticFrames,
  graph: DependencyGraph
) => {
  const updatedFrames: SyntheticFrames = {};

  for (const sourceId in oldFrames) {
    if (getPCNodeDependency(sourceId, graph)) {
      updatedFrames[sourceId] = oldFrames[sourceId];
    }
  }
  for (const sourceFrameId in newFrames) {
    const newFrame = newFrames[sourceFrameId];
    const oldFrame = oldFrames[sourceFrameId];

    if (oldFrame === newFrame) {
      updatedFrames[sourceFrameId] = oldFrame;
      continue;
    }

    const patchedRoot = oldFrame
      ? patchSyntheticNode(
          diffSyntheticNode(oldFrame.root, newFrame.root),
          oldFrame.root
        )
      : newFrame.root;

    updatedFrames[sourceFrameId] = {
      ...(oldFrame || EMPTY_OBJECT),
      ...newFrame,
      root: patchedRoot
    };
  }

  return updatedFrames;
};

export const updateSyntheticNodeMetadata = (
  metadata: KeyValue<any>,
  node: SyntheticNode,
  root: SyntheticNode
) =>
  updateNestedNode(node, root, node => ({
    ...node,
    metadata: {
      ...node.metadata,
      ...metadata
    }
  }));
