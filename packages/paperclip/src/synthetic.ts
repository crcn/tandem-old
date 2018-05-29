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
  shiftBounds
} from "tandem-common";
import { values } from "lodash";
import { DependencyGraph } from "./graph";
import {
  getPCNode,
  PCVisibleNode,
  getPCNodeFrame,
  getPCNodeDependency,
  PCSourceTagNames
} from "./dsl";
import { diffSyntheticNode, patchSyntheticNode } from ".";

export type ComputedDisplayInfo = {
  [identifier: string]: {
    bounds: Bounds;
    style: CSSStyleDeclaration;
  };
};

// what reducer stuff actally access
export type PaperclipState = {
  openDependencyUri?: string;

  // key = frame id, value = evaluated frame
  syntheticFrames: SyntheticFrames;

  graph: DependencyGraph;
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
  $container?: HTMLIFrameElement;
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
  isCreatedFromComponent?: boolean
): SyntheticTextNode => ({
  label,
  id: generateUID(),
  metadata: EMPTY_OBJECT,
  value,
  isCreatedFromComponent,
  source,
  name: PCSourceTagNames.TEXT,
  style,
  children: EMPTY_ARRAY
});

export const getSyntheticSourceNode = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getPCNode(node.source.nodeId, graph) as PCVisibleNode;

export const getSyntheticFramesByDependencyUri = memoize(
  (uri: string, state: PaperclipState): SyntheticFrame[] => {
    return values(state.syntheticFrames).filter((frame: SyntheticFrame) => {
      return getPCNodeDependency(frame.source.nodeId, state.graph).uri === uri;
    });
  }
);

export const getSyntheticFrameDependencyUri = (
  frame: SyntheticFrame,
  state: PaperclipState
) => {
  return getPCNodeDependency(frame.root.source.nodeId, state.graph).uri;
};

export const getSyntheticNodeFrame = memoize(
  (syntheticNodeId: string, state: PaperclipState): SyntheticFrame => {
    for (const sourceFrameId in state.syntheticFrames) {
      const frame = state.syntheticFrames[sourceFrameId];
      if (getNestedTreeNodeById(syntheticNodeId, frame.root)) {
        return frame;
      }
    }
    return null;
  }
);

export const getSyntheticSourceUri = (
  syntheticNode: SyntheticNode,
  state: PaperclipState
) => {
  return getPCNodeDependency(syntheticNode.source.nodeId, state.graph).uri;
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

export const getSyntheticNodeById = memoize(
  (syntheticNodeId: string, state: PaperclipState): SyntheticNode => {
    return getNestedTreeNodeById(
      syntheticNodeId,
      getSyntheticNodeFrame(syntheticNodeId, state).root
    );
  }
);

export const getSyntheticNodeComputedBounds = (
  syntheticNodeId: string,
  state: PaperclipState
) => {
  const frame = getSyntheticNodeFrame(syntheticNodeId, state);
  return (
    frame.computed &&
    frame.computed[syntheticNodeId] &&
    frame.computed[syntheticNodeId].bounds
  );
};

export const getSyntheticNodeBounds = (
  syntheticNodeId: string,
  state: PaperclipState
): Bounds => {
  const frame = getSyntheticNodeFrame(syntheticNodeId, state);
  return shiftBounds(
    getSyntheticNodeComputedBounds(syntheticNodeId, state),
    frame.bounds
  );
};

export const findRootInstanceOfPCNode = (
  node: PCVisibleNode,
  state: PaperclipState
) => {
  const frames = getSyntheticFramesByDependencyUri(
    getPCNodeDependency(node.id, state.graph).uri,
    state
  );
  const frame = frames.find(frame => frame.root.source.nodeId === node.id);
  return frame && frame.root;
};

export const getSyntheticSourceFrame = (
  node: SyntheticNode,
  graph: DependencyGraph
) =>
  getPCNodeFrame(
    node.source.nodeId,
    getPCNodeDependency(node.source.nodeId, graph).content
  );
export const isSyntheticNodeRoot = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getSyntheticSourceFrame(node, graph).children[0].id === node.source.nodeId;

export const mergeSyntheticFrames = (
  oldFrames: SyntheticFrames,
  newFrames: SyntheticFrames
) => {
  const updatedFrames: SyntheticFrames = { ...oldFrames };
  for (const sourceFrameId in newFrames) {
    const newFrame = newFrames[sourceFrameId];
    const oldFrame = oldFrames[sourceFrameId];
    if (oldFrame === newFrame) {
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

export const persistSyntheticNodeChanges = (
  node: SyntheticNode,
  state: PaperclipState,
  updater: TreeNodeUpdater<SyntheticNode>
): PaperclipState => {
  return state;
};
