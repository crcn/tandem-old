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
  replaceNestedNode,
  arraySplice
} from "tandem-common";
import { values, omit, pickBy, last, identity } from "lodash";
import { DependencyGraph, Dependency, updateGraphDependency } from "./graph";
import {
  PCNode,
  getPCNode,
  PCVisibleNode,
  createPCComponent,
  getPCNodeContentNode,
  getPCNodeDependency,
  PCSourceTagNames,
  replacePCNode,
  PCComponent,
  assertValidPCModule,
  PCElement,
  createPCComponentInstance,
  getPCNodeModule,
  PCModule,
  PCTextNode,
  PCOverride,
  createPCTextNode,
  createPCOverride,
  PCOverridablePropertyName,
  PCVisibleNodeMetadataKey,
  updatePCNodeMetadata
} from "./dsl";
import {
  SyntheticVisibleNode,
  getSyntheticVisibleNodeDocument,
  getSyntheticNodeById,
  upsertSyntheticDocument,
  getSyntheticSourceNode,
  getSyntheticDocumentByDependencyUri,
  getSyntheticDocumentDependencyUri,
  SyntheticElement,
  SyntheticTextNode,
  findFurthestParentComponentInstance,
  getAllParentComponentInstance,
  SyntheticDocument,
  getSyntheticSourceUri,
  SYNTHETIC_DOCUMENT_NODE_NAME
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

const NO_BOUNDS = { left: 0, top: 0, right: 0, bottom: 0 };

const FRAME_PADDING = 10;
const PASTED_FRAME_OFFSET = { left: FRAME_PADDING, top: FRAME_PADDING };

export const DEFAULT_FRAME_BOUNDS: Bounds = {
  left: 0,
  top: 0,
  right: 400,
  bottom: 300
};

/*------------------------------------------
 * STATE
 *-----------------------------------------*/

export type PCNodeClip = {
  uri: string;
  node: PCNode;
  fixedBounds: Bounds;
};

// namespaced to ensure that key doesn't conflict with others
export type PCEditorState = {
  openDependencyUri?: string;

  documents: SyntheticDocument[];

  // key = frame id, value = evaluated frame
  frames: Frame[];

  graph: DependencyGraph;
};

export type ComputedDisplayInfo = {
  [identifier: string]: {
    bounds: Bounds;
    style: CSSStyleDeclaration;
  };
};

export type Frame = {
  contentNodeId: string;
  bounds: Bounds;

  // internal only
  $container?: HTMLElement;
  computed?: ComputedDisplayInfo;
};

/*------------------------------------------
 * GETTERS
 *-----------------------------------------*/

export const getFramesContentNodeIdMap = memoize((frames: Frame[]): {
  [identifier: string]: Frame;
} => {
  const map = {};
  for (const frame of frames) {
    map[frame.contentNodeId] = frame;
  }
  return map;
});

export const getSyntheticDocumentFrames = memoize(
  (document: SyntheticDocument, frames: Frame[]) => {
    const frameMap = getFramesContentNodeIdMap(frames);
    return document.children.map(contentNode => frameMap[contentNode.id]);
  }
);

export const getFramesByDependencyUri = memoize(
  (
    uri: string,
    frames: Frame[],
    documents: SyntheticDocument[],
    graph: DependencyGraph
  ) => {
    const document = getSyntheticDocumentByDependencyUri(uri, documents, graph);
    return document ? getSyntheticDocumentFrames(document, frames) : [];
  }
);

export const getSyntheticVisibleNodeComputedBounds = (
  syntheticNodeId: string,
  frame: Frame
) => {
  return (
    (frame.computed &&
      frame.computed[syntheticNodeId] &&
      frame.computed[syntheticNodeId].bounds) ||
    NO_BOUNDS
  );
};

export const getSyntheticVisibleNodeFrame = memoize(
  (nodeId: string, frames: Frame[]) =>
    frames.find(frame => Boolean(frame.computed && frame.computed[nodeId]))
);
export const getFrameByContentNodeId = memoize(
  (nodeId: string, frames: Frame[]) =>
    frames.find(frame => frame.contentNodeId === nodeId)
);

export const getSyntheticVisibleNodeRelativeBounds = memoize(
  (syntheticNodeId: string, frames: Frame[]): Bounds => {
    const frame = getSyntheticVisibleNodeFrame(syntheticNodeId, frames);
    return frame
      ? shiftBounds(
          getSyntheticVisibleNodeComputedBounds(syntheticNodeId, frame),
          frame.bounds
        )
      : NO_BOUNDS;
  }
);

export const getFrameSyntheticNode = memoize(
  (frame: Frame, documents: SyntheticDocument[]) =>
    getSyntheticNodeById(frame.contentNodeId, documents)
);
export const getSyntheticVisibleNodeFixedBounds = memoize(
  (syntheticNodeId: string, frames: Frame[]): Bounds => {
    const frame = getSyntheticVisibleNodeFrame(syntheticNodeId, frames);
    return frame
      ? shiftBounds(
          getSyntheticVisibleNodeRelativeBounds(syntheticNodeId, frames),
          frame.bounds
        )
      : NO_BOUNDS;
  }
);

export const getPCNodeClip = (
  node: SyntheticVisibleNode,
  frames: Frame[],
  graph: DependencyGraph
): PCNodeClip => {
  const sourceNode = getSyntheticSourceNode(node, graph);
  const frame = getSyntheticVisibleNodeFrame(node.id, frames);
  return {
    uri: getSyntheticSourceUri(node, graph),
    node: sourceNode,
    fixedBounds: node.isContentNode
      ? frame.bounds
      : getSyntheticVisibleNodeRelativeBounds(node.id, frames)
  };
};

/*------------------------------------------
 * SETTERS
 *-----------------------------------------*/

export const updatePCEditorState = <TState extends PCEditorState>(
  properties: Partial<PCEditorState>,
  state: TState
): TState => {
  return {
    ...(state as any),
    ...properties
  };
};

export const updateDependencyGraph = <TState extends PCEditorState>(
  properties: Partial<DependencyGraph>,
  state: TState
) =>
  updatePCEditorState(
    {
      graph: {
        ...state.graph,
        ...properties
      }
    },
    state
  );

const replaceDependencyGraphPCNode = <TState extends PCEditorState>(
  newNode: PCNode,
  oldNode: PCNode,
  state: TState
) => updateDependencyGraph(replacePCNode(newNode, oldNode, state.graph), state);

export const replaceDependency = <TState extends PCEditorState>(
  dep: Dependency<any>,
  state: TState
) =>
  persistChanges(state, state =>
    updateDependencyGraph({ [dep.uri]: dep }, state)
  );

export const queueLoadDependencyUri = <TState extends PCEditorState>(
  uri: string,
  state: TState
) =>
  state.graph[uri]
    ? state
    : updatePCEditorState({ openDependencyUri: uri }, state);

export const removeFrame = <TState extends PCEditorState>(
  { contentNodeId }: Frame,
  state: TState
) => {
  const frame = getFrameByContentNodeId(contentNodeId, state.frames);
  if (frame == null) {
    throw new Error(`Frame does not exist`);
  }
  return updatePCEditorState(
    {
      frames: arraySplice(state.frames, state.frames.indexOf(frame), 1)
    },
    state
  );
};

export const getSyntheticDocumentById = memoize(
  (id: string, documents: SyntheticDocument[]) =>
    documents.find(document => document.id === id)
);

export const updateSyntheticDocument = <TState extends PCEditorState>(
  properties: Partial<SyntheticDocument>,
  { id }: SyntheticDocument,
  state: TState
) => {
  const document = getSyntheticDocumentById(id, state.documents);
  if (!document) {
    throw new Error(` document does not exist`);
  }
  return {
    ...(state as any),
    documents: arraySplice(
      state.documents,
      state.documents.indexOf(document),
      1,
      {
        ...document,
        ...properties
      }
    )
  };
};

export const removeSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  const document = getSyntheticVisibleNodeDocument(node.id, state.documents);
  if (node.isContentNode) {
    state = removeFrame(
      getSyntheticVisibleNodeFrame(node.id, state.frames),
      state
    );
  }

  return updateSyntheticDocument(
    removeNestedTreeNode(node, document),
    document,
    state
  );
};

export const updateSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState,
  updater: TreeNodeUpdater<SyntheticVisibleNode>
) => {
  const document = getSyntheticVisibleNodeDocument(node.id, state.documents);
  return updateSyntheticDocument(
    updateNestedNode(node, document, updater),
    document,
    state
  );
};

export const updateFramePosition = <TState extends PCEditorState>(
  position: Point,
  { contentNodeId }: Frame,
  state: TState
) => {
  const frame = getFrameByContentNodeId(contentNodeId, state.frames);
  return updateFrameBounds(moveBounds(frame.bounds, position), frame, state);
};

export const updateFrame = <TState extends PCEditorState>(
  properties: Partial<Frame>,
  { contentNodeId }: Frame,
  state: TState
) => {
  const frame = getFrameByContentNodeId(contentNodeId, state.frames);
  if (!frame) {
    throw new Error("frame does not exist");
  }
  return updatePCEditorState(
    {
      frames: arraySplice(state.frames, state.frames.indexOf(frame), 1, {
        ...frame,
        ...properties
      })
    },
    state
  );
};

export const updateFrameBounds = <TState extends PCEditorState>(
  bounds: Bounds,
  frame: Frame,
  state: TState
) => {
  return updateFrame(
    {
      bounds
    },
    frame,
    state
  );
};

export const updateSyntheticVisibleNodePosition = <
  TState extends PCEditorState
>(
  position: Point,
  node: SyntheticVisibleNode,
  state: TState
) => {
  if (node.isContentNode) {
    return updateFramePosition(
      position,
      getSyntheticVisibleNodeFrame(node.id, state.frames),
      state
    );
  }

  return updateSyntheticVisibleNode(node, state, node => {
    const bounds = getSyntheticVisibleNodeRelativeBounds(node.id, state.frames);
    const newBounds = convertFixedBoundsToRelative(
      moveBounds(bounds, position),
      node,
      getSyntheticVisibleNodeDocument(node.id, state.documents),
      getSyntheticVisibleNodeFrame(node.id, state.frames)
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

export const updateSyntheticVisibleNodeBounds = <TState extends PCEditorState>(
  bounds: Bounds,
  node: SyntheticVisibleNode,
  state: TState
) => {
  if (node.isContentNode) {
    return updateFrameBounds(
      bounds,
      getSyntheticVisibleNodeFrame(node.id, state.frames),
      state
    );
  }

  throw new Error("TODO");
  // return updateSyntheticVisibleNode(node, state, (node) => {
  //   const bounds = getSyntheticVisibleNodeRelativeBounds(node.id, state.frames);
  //   const newBounds = convertFixedBoundsToRelative(
  //     moveBounds(bounds, position),
  //     node,
  //     getSyntheticVisibleNodeDocument(node.id, state.frames)
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

const upsertFrames = <TState extends PCEditorState>(state: TState) => {
  const frames: Frame[] = [];

  const framesByContentNodeId = getFramesContentNodeIdMap(state.frames);

  for (const document of state.documents) {
    for (const contentNode of document.children) {
      frames.push(
        framesByContentNodeId[contentNode.id] || {
          contentNodeId: contentNode.id,

          // todo add warning here that bounds do not exist when they should.
          bounds:
            contentNode.metadata[PCVisibleNodeMetadataKey.BOUNDS] ||
            DEFAULT_FRAME_BOUNDS
        }
      );
    }
  }

  return updatePCEditorState({ frames }, state);
};

export const evaluateDependency = memoize(
  <TState extends PCEditorState>(uri: string, state: TState) => {
    // re-evaluate the updated dependency graph and merge those changes into the existing frames to ensure
    // that references are still maintianed.
    const documents = upsertSyntheticDocument(
      evaluatePCModule(state.graph[uri].content, state.graph),
      state.documents,
      state.graph
    );

    return upsertFrames(updatePCEditorState({ documents }, state));
  }
);

/*------------------------------------------
 * PERSISTING
 *-----------------------------------------*/

const persistChanges = <TState extends PCEditorState>(
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

export const persistChangeLabel = <TState extends PCEditorState>(
  newLabel: string,
  node: SyntheticVisibleNode,
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

export const persistConvertNodeToComponent = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
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

    if (node.isContentNode) {
      return replaceDependencyGraphPCNode(component, sourceNode, state);
    }

    const module = getPCNodeModule(sourceNode.id, state.graph);
    state = replaceDependencyGraphPCNode(
      appendChildNode(addBoundsMetadata(node, component, state), module),
      module,
      state
    );

    const componentInstance = createPCComponentInstance(component.id);

    state = replaceDependencyGraphPCNode(componentInstance, sourceNode, state);

    return state;
  });

const moveBoundsToEmptySpace = (bounds: Bounds, frames: Frame[]) => {
  const intersecting = values(frames).some((frame: Frame) =>
    pointIntersectsBounds(bounds, frame.bounds)
  );
  if (!intersecting) return bounds;
  const entireBounds = getEntireFrameBounds(frames);
  return moveBounds(bounds, {
    left: entireBounds.right + FRAME_PADDING,
    top: entireBounds.top
  });
};

export const getEntireFrameBounds = (frames: Frame[]) =>
  mergeBounds(...values(frames).map(frame => frame.bounds));

export const persistInsertNode = <TState extends PCEditorState>(
  newChild: PCVisibleNode | PCComponent,
  relative: SyntheticVisibleNode | SyntheticDocument,
  offset: TreeMoveOffset,
  state: TState
) =>
  persistChanges(state, state => {
    let parent: PCVisibleNode;

    if (relative.name === SYNTHETIC_DOCUMENT_NODE_NAME) {
      parent = appendChildNode(
        newChild,
        getSyntheticSourceNode(relative, state.graph)
      );
    } else {
      parent = maybeOverride(
        PCOverridablePropertyName.CHILDREN,
        newChild,
        (child, existing) =>
          existing ? [...existing.children, newChild] : [newChild],
        (parent, value) => dropChildNode(value, offset, parent, parent)
      )(relative as SyntheticVisibleNode, state.documents, state.graph);
    }

    return replaceDependencyGraphPCNode(parent, parent, state);
  });

export const persistInsertClips = <TState extends PCEditorState>(
  clips: PCNodeClip[],
  target: PCNode,
  state: TState
): TState =>
  persistChanges(state, state => {
    const targetDep = getPCNodeDependency(target.id, state.graph);
    let targetNode =
      getParentTreeNode(target.id, targetDep.content) ||
      getNestedTreeNodeById(target.id, targetDep.content);

    const targetNodeIsModule = targetNode === targetDep.content;
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

        if (targetNodeIsModule) {
          content = appendChildNode(
            updatePCNodeMetadata(
              {
                [PCVisibleNodeMetadataKey.BOUNDS]: shiftBounds(
                  fixedBounds,
                  PASTED_FRAME_OFFSET
                )
              },
              componentInstance
            ),
            content
          );
        } else {
          content = replaceNestedNode(
            appendChildNode(componentInstance, target),
            target.id,
            content
          );
        }
      } else {
        let clonedChild = cloneTreeNode(sourceNode);
        if (
          targetNodeIsModule &&
          !clonedChild.metadata[PCVisibleNodeMetadataKey.BOUNDS]
        ) {
          clonedChild = updatePCNodeMetadata(
            {
              [PCVisibleNodeMetadataKey.BOUNDS]: shiftBounds(
                fixedBounds,
                PASTED_FRAME_OFFSET
              )
            },
            clonedChild
          );
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

export const persistChangeSyntheticTextNodeValue = <
  TState extends PCEditorState
>(
  value: string,
  node: SyntheticTextNode,
  state: TState
) => {
  return persistChanges(state, state => {
    const updatedNode = maybeOverride(
      PCOverridablePropertyName.TEXT,
      value,
      identity,
      (sourceNode: PCTextNode) => ({
        ...sourceNode,
        value
      })
    )(node, state.documents, state.graph);

    state = replaceDependencyGraphPCNode(updatedNode, updatedNode, state);
    return state;
  });
};

// TODO: test me, I'm complicated D:
const maybeOverride = (
  propertyName: PCOverridablePropertyName,
  value: any,
  mapOverride: (value, override) => any,
  updater: (node: PCVisibleNode, value: any) => any
) => <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  documents: SyntheticDocument[],
  graph: DependencyGraph
): PCVisibleNode => {
  const sourceNode = getSyntheticSourceNode(node, graph);

  if (node.isCreatedFromComponent) {
    const document = getSyntheticVisibleNodeDocument(node.id, documents);
    const parentComponentInstances = getAllParentComponentInstance(
      node,
      document
    );
    if (parentComponentInstances.length) {
      const furthestInstance: SyntheticVisibleNode = last(
        parentComponentInstances
      );
      const furthestInstanceSourceNode = getSyntheticSourceNode(
        furthestInstance,
        graph
      );

      // source node is an override, so go through the normal pr
      if (getNestedTreeNodeById(sourceNode.id, furthestInstanceSourceNode)) {
        return updater(sourceNode, value);
      }

      const overrideIdPath = [
        ...parentComponentInstances
          .concat()
          .reverse()
          .slice(1)
          .map(node => node.id),
        sourceNode.id
      ];

      let existingOverride = furthestInstanceSourceNode.children.find(
        (child: PCOverride) => {
          return (
            child.name === PCSourceTagNames.OVERRIDE &&
            child.targetIdPath.join("/") === overrideIdPath.join("/") &&
            child.propertyName === propertyName
          );
        }
      ) as PCOverride;

      value = mapOverride(value, existingOverride);

      if (existingOverride) {
        if (
          existingOverride.propertyName === PCOverridablePropertyName.CHILDREN
        ) {
          existingOverride = {
            ...existingOverride,
            children: value
          };
        } else {
          existingOverride = {
            ...existingOverride,
            value
          };
        }

        return replaceNestedNode(
          existingOverride,
          existingOverride.id,
          furthestInstanceSourceNode
        );
      } else {
        const override = createPCOverride(overrideIdPath, propertyName, value);
        return appendChildNode(override, furthestInstanceSourceNode);
      }
    }
  }

  return updater(sourceNode, value);
};

export const persistSyntheticVisibleNodeBounds = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) =>
  persistChanges(state, state => {
    const document = getSyntheticVisibleNodeDocument(node.id, state.documents);
    if (node.isContentNode) {
      const frame = getSyntheticVisibleNodeFrame(
        node.source.nodeId,
        state.frames
      ) as Frame;
      const sourceNode = getSyntheticSourceNode(node, state.graph);
      return replaceDependencyGraphPCNode(
        updatePCNodeMetadata(
          {
            [PCVisibleNodeMetadataKey.BOUNDS]: frame.bounds
          },
          sourceNode
        ),
        sourceNode,
        state
      );
    } else {
      throw new Error("TODO");
    }
  });

// TODO - need to
export const persistMoveSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  newRelative: SyntheticVisibleNode,
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
    if (node.isContentNode) {
      state = replaceDependencyGraphPCNode(
        null,
        getPCNodeContentNode(
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

    // if (destParent.name === PCSourceTagNames.FRAME) {
    //   destParent = getParentTreeNode(destParent.id, destContent) as PCNode;
    // }

    destContent = updateNestedNode(destParent, destContent, parent => {
      let child = sourceNode as PCNode;
      if (destParent.name === PCSourceTagNames.MODULE) {
        child = addBoundsMetadata(node, sourceNode, oldState);
      }
      return insertChildNode(child, index, parent);
    });

    state = replaceDependencyGraphPCNode(destContent, destContent, state);

    return state;
  });

const addBoundsMetadata = (
  node: SyntheticVisibleNode,
  child: PCVisibleNode | PCComponent,
  state: PCEditorState
) => {
  const frame = getSyntheticVisibleNodeFrame(node.id, state.frames);
  const syntheticNodeBounds = getSyntheticVisibleNodeRelativeBounds(
    node.id,
    state.frames
  );

  let bestBounds = syntheticNodeBounds
    ? moveBounds(syntheticNodeBounds, frame.bounds)
    : DEFAULT_FRAME_BOUNDS;
  bestBounds = moveBoundsToEmptySpace(bestBounds, state.frames);

  return updatePCNodeMetadata(
    {
      [PCVisibleNodeMetadataKey.BOUNDS]: bestBounds
    },
    child
  );
};

export const persistRawCSSText = <TState extends PCEditorState>(
  text: string,
  node: SyntheticVisibleNode,
  state: TState
) => persistSyntheticVisibleNodeStyle(parseStyle(text), node, state);

export const persistSyntheticVisibleNodeStyle = <TState extends PCEditorState>(
  style: any,
  node: SyntheticVisibleNode,
  state: TState
) =>
  persistChanges(state, state => {
    // TODO - need to move
    const updatedNode = maybeOverride(
      PCOverridablePropertyName.STYLE,
      style,
      (style, override) => {
        const minStyle = {};
        const overrideStyle = (override && override.value) || EMPTY_OBJECT;
        for (const key in style) {
          if (overrideStyle[key] || node.style[key] !== style[key]) {
            minStyle[key] = style[key];
          }
        }
        return minStyle;
      },
      sourceNode =>
        ({
          ...sourceNode,
          style
        } as PCVisibleNode)
    )(node, state.documents, state.graph);

    // todo - need to consider variants here
    return replaceDependencyGraphPCNode(updatedNode, updatedNode, state);
  });

export const persistRemoveSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) =>
  persistChanges(state, state => {
    const sourceNode = getPCNode(node.source.nodeId, state.graph);
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
