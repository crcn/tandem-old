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
  moveBounds,
  TreeMoveOffset,
  insertChildNode,
  dropChildNode,
  removeNestedTreeNode,
  getTreeNodePath,
  getTreeNodeFromPath,
  getParentTreeNode
} from "tandem-common";
import { values, omit, pickBy } from "lodash";
import { DependencyGraph, Dependency, updateGraphDependency } from "./graph";
import {
  PCNode,
  getPCNode,
  PCVisibleNode,
  getPCNodeFrame,
  getPCNodeDependency,
  PCSourceTagNames,
  PCFrame,
  replacePCNode,
  PCComponent,
  assertValidPCModule
} from "./dsl";
import {
  SyntheticFrames,
  SyntheticNode,
  SyntheticFrame,
  getSyntheticNodeFrame,
  getSyntheticNodeBounds,
  getSyntheticNodeById,
  updateSyntheticFrames,
  getSyntheticSourceNode,
  getSyntheticFramesByDependencyUri,
  getSyntheticFrameDependencyUri
} from "./synthetic";
import {
  diffSyntheticNode,
  patchSyntheticNode,
  SyntheticOperationalTransformType
} from "./ot";
import { convertFixedBoundsToRelative } from "./synthetic-layout";
import { evaluatePCModule } from ".";

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
) => {
  // TODO - need to re-evaluate
  return updateDependencyGraph({ [dep.uri]: dep }, state);
};

export const queueLoadDependencyUri = <TState extends PCState>(
  uri: string,
  state: TState
) =>
  state.graph[uri] ? state : updatePCState({ openDependencyUri: uri }, state);

export const removeSyntheticFrame = <TState extends PCState>(
  frame: SyntheticFrame,
  state: TState
) =>
  updatePCState(
    {
      syntheticFrames: omit(state.syntheticFrames, [frame.source.nodeId])
    },
    state
  );

export const removeSyntheticNode = <TState extends PCState>(
  node: SyntheticNode,
  state: TState
) => {
  const frame = getSyntheticNodeFrame(node.id, state.syntheticFrames);

  if (node.isRoot) {
    return removeSyntheticFrame(frame, state);
  }
  return updateSyntheticFrame(
    {
      root: removeNestedTreeNode(node, frame.root)
    },
    frame,
    state
  );
};

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

const assertValidDependencyGraph = memoize((graph: DependencyGraph) => {
  for (const uri in graph) {
    assertValidPCModule(graph[uri].content);
  }
});

export const evaluateDependency = memoize(
  <TState extends PCState>(uri: string, state: TState) =>
    updatePCState(
      {
        // re-evaluate the updated dependency graph and merge those changes into the existing frames to ensure
        // that references are still maintianed.
        syntheticFrames: updateSyntheticFrames(
          state.syntheticFrames,
          evaluatePCModule(state.graph[uri].content, state.graph),
          state.graph
        )
      },
      state
    )
);

/*------------------------------------------
 * PERSISTING
 *-----------------------------------------*/

const persistChanges = <TState extends PCState>(
  state: TState,
  updater: (state: TState) => TState
) => {
  state = updater(state);

  // sanity check.
  assertValidDependencyGraph(state.graph);

  for (const uri in state.graph) {
    state = evaluateDependency(uri, state);
  }
  return state;
};

export const persistInsertNode = <TState extends PCState>(
  newChild: PCFrame | PCVisibleNode | PCComponent,
  relative: PCNode,
  offset: TreeMoveOffset,
  state: TState
) =>
  persistChanges(state, state => {
    const dependency = getPCNodeDependency(relative.id, state.graph);
    return updateDependencyGraph(
      updateGraphDependency(
        {
          content: dropChildNode(newChild, offset, relative, dependency.content)
        },
        dependency.uri,
        state.graph
      ),
      state
    );
  });

export const persistSyntheticNodeBounds = <TState extends PCState>(
  node: SyntheticNode,
  state: TState
) =>
  persistChanges(state, state => {
    const frame = getSyntheticNodeFrame(node.id, state.syntheticFrames);
    if (node.isRoot) {
      const sourceFrame = getPCNode(
        frame.source.nodeId,
        state.graph
      ) as PCFrame;
      return updateDependencyGraph(
        replacePCNode(
          {
            ...sourceFrame,
            bounds: frame.bounds
          },
          sourceFrame,
          state.graph
        ),
        state
      );
    } else {
      throw new Error("TODO");
    }
  });

export const persistRemoveSyntheticNode = <TState extends PCState>(
  node: SyntheticNode,
  state: TState
) =>
  persistChanges(state, state => {
    const frame = getSyntheticNodeFrame(node.id, state.syntheticFrames);
    const sourceNode = node.isRoot
      ? (getPCNode(frame.source.nodeId, state.graph) as PCFrame)
      : getSyntheticSourceNode(node, state.graph);
    return updateDependencyGraph(
      replacePCNode(null, sourceNode, state.graph),
      state
    );
  });
