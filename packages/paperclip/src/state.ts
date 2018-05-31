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
  getParentTreeNode,
  appendChildNode,
  cloneTreeNode,
  pointIntersectsBounds,
  mergeBounds
} from "tandem-common";
import { values, omit, pickBy } from "lodash";
import { DependencyGraph, Dependency, updateGraphDependency } from "./graph";
import {
  PCNode,
  getPCNode,
  PCVisibleNode,
  createPCComponent,
  getPCNodeFrame,
  getPCNodeDependency,
  PCSourceTagNames,
  PCFrame,
  replacePCNode,
  DEFAULT_FRAME_BOUNDS,
  PCComponent,
  assertValidPCModule,
  PCElement,
  createPCComponentInstance,
  getPCNodeModule,
  createPCFrame
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
  getSyntheticFrameDependencyUri,
  SyntheticElement
} from "./synthetic";
import {
  diffSyntheticNode,
  patchSyntheticNode,
  SyntheticOperationalTransformType
} from "./ot";
import { convertFixedBoundsToRelative } from "./synthetic-layout";
import { evaluatePCModule } from ".";

/*------------------------------------------
 * CONSTANTS
 *-----------------------------------------*/

const FRAME_PADDING = 10;

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

const replaceDependencyGraphPCNode = <TState extends PCState>(
  newNode: PCNode,
  oldNode: PCNode,
  state: TState
) => updateDependencyGraph(replacePCNode(newNode, oldNode, state.graph), state);

export const replaceDependency = <TState extends PCState>(
  dep: Dependency<any>,
  state: TState
) =>
  persistChanges(state, state =>
    updateDependencyGraph({ [dep.uri]: dep }, state)
  );

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

export const persistChangeLabel = <TState extends PCState>(
  newLabel: string,
  node: SyntheticNode,
  state: TState
) =>
  persistChanges(state, state => {
    const sourceNode = getSyntheticSourceNode(node, state.graph);
    return replaceDependencyGraphPCNode(
      {
        ...sourceNode,
        label: newLabel
      },
      sourceNode,
      state
    );
  });

export const persistConvertNodeToComponent = <TState extends PCState>(
  node: SyntheticNode,
  state: TState
) =>
  persistChanges(state, state => {
    const sourceNode = getSyntheticSourceNode(node, state.graph);

    const component = createPCComponent(
      sourceNode.label,
      (sourceNode as PCElement).is,
      sourceNode.style,
      (sourceNode as PCElement).attributes,
      sourceNode.name === PCSourceTagNames.TEXT
        ? [cloneTreeNode(sourceNode)]
        : (sourceNode.children || []).map(node => cloneTreeNode(node))
    );

    if (node.isRoot) {
      return replaceDependencyGraphPCNode(component, sourceNode, state);
    }

    const frame = getSyntheticNodeFrame(node.id, state.syntheticFrames);
    const syntheticNodeBounds = getSyntheticNodeBounds(
      node.id,
      state.syntheticFrames
    );

    let bestBounds = syntheticNodeBounds
      ? moveBounds(syntheticNodeBounds, frame.bounds)
      : DEFAULT_FRAME_BOUNDS;

    bestBounds = moveBoundsToEmptySpace(bestBounds, state.syntheticFrames);

    const module = getPCNodeModule(sourceNode.id, state.graph);
    state = replaceDependencyGraphPCNode(
      appendChildNode(createPCFrame([component], bestBounds), module),
      module,
      state
    );

    const componentInstance = createPCComponentInstance(component.id);

    state = replaceDependencyGraphPCNode(componentInstance, sourceNode, state);

    return state;
  });

const moveBoundsToEmptySpace = (bounds: Bounds, frames: SyntheticFrames) => {
  const intersecting = values(frames).some((frame: SyntheticFrame) =>
    pointIntersectsBounds(bounds, frame.bounds)
  );
  if (!intersecting) return bounds;
  const entireBounds = getEntireFrameBounds(frames);
  return moveBounds(bounds, {
    left: entireBounds.right + FRAME_PADDING,
    top: entireBounds.top
  });
};

export const getEntireFrameBounds = (frames: SyntheticFrames) =>
  mergeBounds(...values(frames).map(frame => frame.bounds));

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
      return replaceDependencyGraphPCNode(
        {
          ...sourceFrame,
          bounds: frame.bounds
        },
        sourceFrame,
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
    return replaceDependencyGraphPCNode(null, sourceNode, state);
  });
