import {
  KeyValue,
  generateUID,
  EMPTY_ARRAY,
  TreeNodeUpdater,
  EMPTY_OBJECT
} from "tandem-common";
import { TreeNode, Bounds } from "tandem-common";
import { DependencyGraph } from "./graph";
import {
  getPCNode,
  PCVisibleNode,
  getPCNodeFrame,
  getPCNodeDependency
} from "./dsl";

export type ComputedDisplayInfo = {
  [identifier: string]: {
    bounds: Bounds;
    style: CSSStyleDeclaration;
  };
};

// what reducer stuff actally access
export type PaperclipState = {
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

  // internal only
  $container?: HTMLIFrameElement;
  computed?: ComputedDisplayInfo;
};

export type SyntheticBaseNode = {
  source: SyntheticSource;
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
  children: SyntheticNode[] = []
): SyntheticElement => ({
  id: generateUID(),
  source,
  name,
  attributes,
  style,
  children
});

export const createSyntheticTextNode = (
  value: string,
  source: SyntheticSource,
  style: KeyValue<any> = {}
): SyntheticTextNode => ({
  id: generateUID(),
  value,
  source,
  name,
  style,
  children: EMPTY_ARRAY
});

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
export const isSyntheticNodeRoot = (
  node: SyntheticNode,
  graph: DependencyGraph
) => getSyntheticSourceFrame(node, graph).children[0].id === node.source.nodeId;

export const mergeSyntheticFrames = (
  oldFrames: SyntheticFrames,
  newFrames: SyntheticFrames
) => {
  const updatedFrames: SyntheticFrames = {};
  for (const sourceFrameId in newFrames) {
    const newFrame = newFrames[sourceFrameId];
    const oldFrame = oldFrames[sourceFrameId];
    if (!oldFrame || oldFrame === newFrame) {
      continue;
    }

    const ots = []; //
    const patchedRoot = newFrame.root;

    updatedFrames[sourceFrameId] = {
      ...oldFrame,
      root: patchedRoot,
      computed: newFrame.computed
    };
  }

  return updatedFrames;
};

export const persistSyntheticNodeChanges = (
  node: SyntheticNode,
  state: PaperclipState,
  updater: TreeNodeUpdater<SyntheticNode>
): PaperclipState => {
  return state;
};

export const updateSyntheticFrame = (
  properties: Partial<SyntheticFrame>,
  sourceFrameId: string,
  state: PaperclipState
) => ({
  ...state,
  syntheticFrames: {
    ...state.syntheticFrames,
    [sourceFrameId]: {
      ...(state.syntheticFrames[sourceFrameId] || EMPTY_OBJECT),
      ...properties
    }
  }
});
