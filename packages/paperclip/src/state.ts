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
  mergeBounds,
  replaceNestedNode
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
  createPCFrame,
  PCModule,
  PCTextNode
} from "./dsl";
import {
  SyntheticFrames,
  SyntheticNode,
  SyntheticFrame,
  getSyntheticNodeFrame,
  getSyntheticNodeRelativeBounds,
  getSyntheticNodeById,
  updateSyntheticFrames,
  getSyntheticSourceNode,
  getSyntheticFramesByDependencyUri,
  getSyntheticFrameDependencyUri,
  SyntheticElement,
  PCNodeClip,
  SyntheticTextNode
} from "./synthetic";
import * as path from "path";
import {
  diffSyntheticNode,
  patchSyntheticNode,
  SyntheticOperationalTransformType
} from "./ot";
import { convertFixedBoundsToRelative } from "./synthetic-layout";
import { evaluatePCModule } from "./evaluate";

/*------------------------------------------
 * CONSTANTS
 *-----------------------------------------*/

const FRAME_PADDING = 10;
const PASTED_FRAME_OFFSET = { left: FRAME_PADDING, top: FRAME_PADDING };

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
    const bounds = getSyntheticNodeRelativeBounds(
      node.id,
      state.syntheticFrames
    );
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
  //   const bounds = getSyntheticNodeRelativeBounds(node.id, state.syntheticFrames);
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

    const module = getPCNodeModule(sourceNode.id, state.graph);
    state = replaceDependencyGraphPCNode(
      appendChildNode(
        createPCFrameFromSyntheticNode(node, component, state),
        module
      ),
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

export const persistInsertClips = <TState extends PCState>(
  clips: PCNodeClip[],
  target: PCNode,
  state: TState
): TState =>
  persistChanges(state, state => {
    const targetDep = getPCNodeDependency(target.id, state.graph);
    let targetNode =
      getParentTreeNode(target.id, targetDep.content) ||
      getNestedTreeNodeById(target.id, targetDep.content);

    const targetNodeIsModuleRoot = targetNode === targetDep.content;
    const moduleInfo = targetDep.content;

    let content = targetDep.content;
    let graph = state.graph;

    for (const { uri, node, fixedBounds } of clips) {
      const sourceDep = state.graph[uri];
      const sourceNode = node;

      // If there is NO source node, then possibly create a detached node and add to target component
      if (!sourceNode) {
        throw new Error("not implemented");
      }

      // is component
      if (sourceNode.name === PCSourceTagNames.COMPONENT) {
        const componentInstance = createPCComponentInstance(sourceNode.id);

        if (targetNodeIsModuleRoot) {
          content = appendChildNode(
            createPCFrame(
              [componentInstance],
              shiftBounds(fixedBounds, PASTED_FRAME_OFFSET)
            ),
            content
          );
        } else {
          if (target.name === PCSourceTagNames.FRAME) {
            target = target.children[0];
          }
          content = replaceNestedNode(
            appendChildNode(componentInstance, target),
            target.id,
            content
          );
        }
      } else {
        let clonedChild = cloneTreeNode(sourceNode);
        if (
          targetNodeIsModuleRoot &&
          clonedChild.name !== PCSourceTagNames.FRAME
        ) {
          clonedChild = createPCFrame(
            [clonedChild],
            shiftBounds(fixedBounds, PASTED_FRAME_OFFSET)
          );
        }

        if (targetNode.name === PCSourceTagNames.FRAME) {
          targetNode = targetNode.children[0];
        }

        content = replaceNestedNode(
          appendChildNode(clonedChild, targetNode),
          targetNode.id,
          content
        );
      }
    }

    state = replaceDependencyGraphPCNode(content, content, state);

    return state;
  });

export const persistChangeSyntheticTextNodeValue = <TState extends PCState>(
  value: string,
  node: SyntheticTextNode,
  state: TState
) =>
  persistChanges(state, state => {
    const sourceNode = getSyntheticSourceNode(node, state.graph) as PCTextNode;
    state = replaceDependencyGraphPCNode(
      {
        ...sourceNode,
        value
      },
      sourceNode,
      state
    );
    return state;
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

// TODO - need to
export const persistMoveSyntheticNode = <TState extends PCState>(
  node: SyntheticNode,
  newRelative: SyntheticNode,
  offset: TreeMoveOffset,
  state: TState
) =>
  persistChanges(state, state => {
    const oldState = state;
    const sourceNode = getSyntheticSourceNode(node, state.graph);
    const newRelativeSourceNode = getSyntheticSourceNode(
      newRelative,
      state.graph
    );

    // remove the child first
    if (node.isRoot) {
      state = replaceDependencyGraphPCNode(
        null,
        getPCNodeFrame(
          sourceNode.id,
          getPCNodeModule(sourceNode.id, state.graph)
        ),
        state
      );
    } else {
      state = replaceDependencyGraphPCNode(null, sourceNode, state);
    }

    const destDep = getPCNodeDependency(newRelativeSourceNode.id, state.graph);
    let destContent = destDep.content;
    let destParent =
      offset === TreeMoveOffset.APPEND
        ? newRelativeSourceNode
        : (getParentTreeNode(newRelativeSourceNode.id, destContent) as PCNode);
    const index =
      offset === TreeMoveOffset.APPEND
        ? destParent.children.length
        : destParent.children.indexOf(newRelativeSourceNode) +
          (offset === TreeMoveOffset.BEFORE ? 0 : 1);

    if (destParent.name === PCSourceTagNames.FRAME) {
      destParent = getParentTreeNode(destParent.id, destContent) as PCNode;
    }

    destContent = updateNestedNode(destParent, destContent, parent => {
      let child = sourceNode as PCNode;
      if (destParent.name === PCSourceTagNames.MODULE) {
        child = createPCFrameFromSyntheticNode(node, sourceNode, oldState);
      }
      return insertChildNode(child, index, parent);
    });

    state = replaceDependencyGraphPCNode(destContent, destContent, state);

    return state;
  });

const createPCFrameFromSyntheticNode = (
  node: SyntheticNode,
  child: PCVisibleNode | PCComponent,
  state: PCState
) => {
  const frame = getSyntheticNodeFrame(node.id, state.syntheticFrames);
  const syntheticNodeBounds = getSyntheticNodeRelativeBounds(
    node.id,
    state.syntheticFrames
  );

  let bestBounds = syntheticNodeBounds
    ? moveBounds(syntheticNodeBounds, frame.bounds)
    : DEFAULT_FRAME_BOUNDS;
  bestBounds = moveBoundsToEmptySpace(bestBounds, state.syntheticFrames);

  return createPCFrame([child], bestBounds);
};

export const persistRawCSSText = <TState extends PCState>(
  text: string,
  node: SyntheticNode,
  state: TState
) =>
  persistChanges(state, state => {
    const style = parseStyle(text);
    const sourceNode = getSyntheticSourceNode(node, state.graph);

    // todo - need to consider variants here
    return replaceDependencyGraphPCNode(
      {
        ...sourceNode,
        style: style
      },
      sourceNode,
      state
    );
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

const parseStyle = (source: string) => {
  const style = {};
  source.split(";").forEach(decl => {
    const [key, value] = decl.split(":");
    if (!key || !value) return;
    style[key.trim()] = value.trim();
  });
  return style;
};
