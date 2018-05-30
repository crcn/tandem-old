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
  moveBounds
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
  PCFrame
} from "./dsl";
import {
  SyntheticFrames,
  SyntheticNode,
  SyntheticFrame,
  getSyntheticNodeFrame,
  getSyntheticNodeBounds,
  getSyntheticNodeById
} from "./synthetic";
import { diffSyntheticNode, patchSyntheticNode } from "./ot";
import { convertFixedBoundsToRelative } from "./synthetic-layout";

/*------------------------------------------
 * STATE
 *-----------------------------------------*/

// namespaced to ensure that key doesn't conflict with others
export type PCState = {
  openDependencyUri?: string;

  // key = frame id, value = evaluated frame
  syntheticFrames: SyntheticFrames;

  graph: DependencyGraph;
};

/*------------------------------------------
 * GETTERS
 *-----------------------------------------*/

/*------------------------------------------
 * PERSISTING
 *-----------------------------------------*/

export const persistSyntheticNodeChanges = (
  node: SyntheticNode,
  state: PCState,
  updater: TreeNodeUpdater<SyntheticNode>
): PCState => {
  return state;
};

/*------------------------------------------
 * SETTERS
 *-----------------------------------------*/

export const updatePCState = <TState extends PCState>(
  properties: Partial<PCState>,
  state: TState
): TState => {
  return {
    ...(state as any),
    ...properties
  };
};

export const updateDependencyGraph = <TState extends PCState>(
  properties: Partial<DependencyGraph>,
  state: TState
) =>
  updatePCState(
    {
      graph: {
        ...state.graph,
        ...properties
      }
    },
    state
  );

export const replaceDependency = <TState extends PCState>(
  dep: Dependency<any>,
  state: TState
) => updateDependencyGraph({ [dep.uri]: dep }, state);

export const queueLoadDependencyUri = <TState extends PCState>(
  uri: string,
  state: TState
) =>
  state.graph[uri] ? state : updatePCState({ openDependencyUri: uri }, state);

export const updateSyntheticFrame = <TState extends PCState>(
  properties: Partial<SyntheticFrame>,
  frame: SyntheticFrame,
  state: TState
) =>
  updatePCState(
    {
      syntheticFrames: {
        ...state.syntheticFrames,
        [frame.source.nodeId]: {
          ...state.syntheticFrames[frame.source.nodeId],
          ...properties
        }
      }
    },
    state
  );

export const updateSyntheticNode = <TState extends PCState>(
  node: SyntheticNode,
  state: TState,
  updater: TreeNodeUpdater<SyntheticNode>
) => {
  const frame = getSyntheticNodeFrame(node.id, state.syntheticFrames);
  return updateSyntheticFrame(
    {
      root: updateNestedNode(frame.root, node, updater)
    },
    frame,
    state
  );
};

export const updateSyntheticFramePosition = <TState extends PCState>(
  position: Point,
  { source }: SyntheticFrame,
  state: TState
) => {
  const frame = state.syntheticFrames[source.nodeId];
  return updateSyntheticFrameBounds(
    moveBounds(frame.bounds, position),
    frame,
    state
  );
};

export const updateSyntheticFrameBounds = <TState extends PCState>(
  bounds: Bounds,
  frame: SyntheticFrame,
  state: TState
) => {
  return updateSyntheticFrame(
    {
      bounds
    },
    frame,
    state
  );
};

export const updateSyntheticNodePosition = <TState extends PCState>(
  position: Point,
  node: SyntheticNode,
  state: TState
) => {
  if (node.isRoot) {
    return updateSyntheticFramePosition(
      position,
      getSyntheticNodeFrame(node.id, state.syntheticFrames),
      state
    );
  }

  return updateSyntheticNode(node, state, node => {
    const bounds = getSyntheticNodeBounds(node.id, state.syntheticFrames);
    const newBounds = convertFixedBoundsToRelative(
      moveBounds(bounds, position),
      node,
      getSyntheticNodeFrame(node.id, state.syntheticFrames)
    );

    return {
      ...node,
      style: {
        ...node.style,
        left: newBounds.left,
        top: newBounds.top
      }
    };
  });
};

export const updateSyntheticNodeBounds = <TState extends PCState>(
  bounds: Bounds,
  node: SyntheticNode,
  state: TState
) => {
  if (node.isRoot) {
    return updateSyntheticFrameBounds(
      bounds,
      getSyntheticNodeFrame(node.id, state.syntheticFrames),
      state
    );
  }

  throw new Error("TODO");
  // return updateSyntheticNode(node, state, (node) => {
  //   const bounds = getSyntheticNodeBounds(node.id, state.syntheticFrames);
  //   const newBounds = convertFixedBoundsToRelative(
  //     moveBounds(bounds, position),
  //     node,
  //     getSyntheticNodeFrame(node.id, state.syntheticFrames)
  //   );

  //   return {
  //     ...node,
  //     style: {
  //       ...node.style,
  //       left: newBounds.left,
  //       top: newBounds.top
  //     }
  //   };
  // });
};
