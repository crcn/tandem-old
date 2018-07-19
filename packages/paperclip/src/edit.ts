import {
  TreeNodeUpdater,
  EMPTY_OBJECT,
  memoize,
  Bounds,
  updateNestedNode,
  shiftBounds,
  Point,
  moveBounds,
  TreeMoveOffset,
  insertChildNode,
  removeNestedTreeNode,
  getParentTreeNode,
  appendChildNode,
  cloneTreeNode,
  pointIntersectsBounds,
  mergeBounds,
  replaceNestedNode,
  arraySplice,
  stripProtocol,
  getNestedTreeNodeById,
  KeyValue,
  dropChildNode,
  filterNestedNodes,
  EMPTY_ARRAY
} from "tandem-common";
import { values, identity, uniq, last, intersection } from "lodash";
import { DependencyGraph, Dependency } from "./graph";
import {
  PCNode,
  getPCNode,
  PCVisibleNode,
  createPCComponent,
  getPCNodeDependency,
  PCSourceTagNames,
  replacePCNode,
  PCComponent,
  assertValidPCModule,
  PCElement,
  createPCComponentInstance,
  getPCNodeModule,
  PCTextNode,
  PCOverride,
  createPCOverride,
  PCOverridablePropertyName,
  PCVisibleNodeMetadataKey,
  updatePCNodeMetadata,
  createPCVariant,
  PCVariant,
  isComponent,
  getPCVariants,
  isPCOverride,
  isValueOverride,
  PCComponentInstanceElement,
  getPCVariantOverrides,
  filterPCNodes,
  isPCComponentInstance,
  InheritStyle,
  PCBaseVisibleNode,
  PCPropertyBinding
} from "./dsl";
import {
  SyntheticVisibleNode,
  getSyntheticVisibleNodeDocument,
  getSyntheticNodeById,
  getSyntheticSourceNode,
  getSyntheticDocumentByDependencyUri,
  SyntheticElement,
  SyntheticTextNode,
  SyntheticDocument,
  getSyntheticSourceUri,
  getNearestComponentInstances,
  isSyntheticVisibleNode,
  setDocumentChecksum,
  isSyntheticDocument,
  getSyntheticContentNode,
  SyntheticInstanceElement,
  getInheritedAndSelfOverrides
} from "./synthetic";
import * as path from "path";
import { convertFixedBoundsToRelative } from "./synthetic-layout";
import { diffTreeNode, patchTreeNode } from "./ot";
import { evaluatePCModule } from "./evaluate";

/*------------------------------------------
 * CONSTANTS
 *-----------------------------------------*/

const NO_POINT = { left: 0, top: 0 };
const NO_BOUNDS = { ...NO_POINT, right: 0, bottom: 0 };
const MAX_CHECKSUM_COUNT = 40;

const FRAME_PADDING = 10;
const MIN_BOUND_SIZE = 1;
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
  inEdit?: boolean;
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

export const getFramesContentNodeIdMap = memoize(
  (
    frames: Frame[]
  ): {
    [identifier: string]: Frame;
  } => {
    const map = {};
    for (const frame of frames) {
      map[frame.contentNodeId] = frame;
    }
    return map;
  }
);

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
  { id, isContentNode }: SyntheticVisibleNode,
  frame: Frame
) => {
  return isContentNode
    ? moveBounds(frame.bounds, NO_POINT)
    : (frame.computed && frame.computed[id] && frame.computed[id].bounds) ||
        NO_BOUNDS;
};

export const getSyntheticVisibleNodeFrame = memoize(
  (syntheticNode: SyntheticVisibleNode, frames: Frame[]) =>
    frames.find(
      frame =>
        Boolean(frame.computed && frame.computed[syntheticNode.id]) ||
        frame.contentNodeId === syntheticNode.id
    )
);
export const getFrameByContentNodeId = memoize(
  (nodeId: string, frames: Frame[]) =>
    frames.find(frame => frame.contentNodeId === nodeId)
);

export const getSyntheticVisibleNodeRelativeBounds = memoize(
  (syntheticNode: SyntheticVisibleNode, frames: Frame[]): Bounds => {
    const frame = getSyntheticVisibleNodeFrame(syntheticNode, frames);
    return frame
      ? shiftBounds(
          getSyntheticVisibleNodeComputedBounds(syntheticNode, frame),
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
  (syntheticNode: SyntheticVisibleNode, frames: Frame[]): Bounds => {
    const frame = getSyntheticVisibleNodeFrame(syntheticNode, frames);
    return frame
      ? shiftBounds(
          getSyntheticVisibleNodeRelativeBounds(syntheticNode, frames),
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
  const frame = getSyntheticVisibleNodeFrame(node, frames);
  return {
    uri: getSyntheticSourceUri(node, graph),
    node: sourceNode,
    fixedBounds: node.isContentNode
      ? frame.bounds
      : getSyntheticVisibleNodeRelativeBounds(node, frames)
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
) => updateDependencyGraph({ [dep.uri]: dep }, state);

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

  const newDocument = setDocumentChecksum({
    ...document,
    ...properties
  });

  return upsertFrames({
    ...(state as any),
    documents: arraySplice(
      state.documents,
      state.documents.indexOf(document),
      1,
      newDocument
    )
  });
};

export const removeSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  const document = getSyntheticVisibleNodeDocument(node.id, state.documents);
  if (node.isContentNode) {
    state = removeFrame(getFrameByContentNodeId(node.id, state.frames), state);
  }

  return updateSyntheticDocument(
    removeNestedTreeNode(node, document),
    document,
    state
  );
};

export const replaceSyntheticVisibleNode = <TState extends PCEditorState>(
  replacement: SyntheticVisibleNode,
  node: SyntheticVisibleNode,
  state: TState
) => updateSyntheticVisibleNode(node, state, () => replacement);

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

const clampBounds = (bounds: Bounds) => ({
  ...bounds,
  right: Math.max(bounds.right, bounds.left + MIN_BOUND_SIZE),
  bottom: Math.max(bounds.bottom, bounds.top + MIN_BOUND_SIZE)
});

export const updateFrameBounds = <TState extends PCEditorState>(
  bounds: Bounds,
  frame: Frame,
  state: TState
) => {
  return updateFrame(
    {
      bounds: clampBounds(bounds)
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
      getSyntheticVisibleNodeFrame(node, state.frames),
      state
    );
  }

  return updateSyntheticVisibleNode(node, state, node => {
    const bounds = getSyntheticVisibleNodeRelativeBounds(node, state.frames);
    const newBounds = convertFixedBoundsToRelative(
      moveBounds(bounds, position),
      node,
      getSyntheticVisibleNodeDocument(node.id, state.documents),
      getSyntheticVisibleNodeFrame(node, state.frames)
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
      getSyntheticVisibleNodeFrame(node, state.frames),
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

export const upsertFrames = <TState extends PCEditorState>(state: TState) => {
  const frames: Frame[] = [];

  const framesByContentNodeId = getFramesContentNodeIdMap(state.frames);

  for (const document of state.documents) {
    for (const contentNode of document.children) {
      const sourceNode = getSyntheticSourceNode(contentNode, state.graph);
      frames.push({
        ...(framesByContentNodeId[contentNode.id] || EMPTY_OBJECT),
        contentNodeId: contentNode.id,

        // todo add warning here that bounds do not exist when they should.
        bounds:
          sourceNode.metadata[PCVisibleNodeMetadataKey.BOUNDS] ||
          DEFAULT_FRAME_BOUNDS
      });
    }
  }

  return updatePCEditorState({ frames }, state);
};

/*------------------------------------------
 * PERSISTING
 *-----------------------------------------*/

export const persistChangeLabel = <TState extends PCEditorState>(
  newLabel: string,
  node: SyntheticVisibleNode,
  state: TState
) => {
  const newNode = maybeOverride(
    PCOverridablePropertyName.LABEL,
    newLabel,
    null,
    identity,
    node => ({
      ...node,
      label: newLabel
    })
  )(node, state.documents, state.graph);
  console.log(newNode);
  return replaceDependencyGraphPCNode(newNode, newNode, state);
};

export const persistConvertNodeToComponent = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  let sourceNode = getSyntheticSourceNode(node, state.graph);

  if (isComponent(sourceNode)) {
    return state;
  }

  let component = createPCComponent(
    sourceNode.label,
    (sourceNode as PCElement).is,
    sourceNode.style,
    (sourceNode as PCElement).attributes,
    sourceNode.name === PCSourceTagNames.TEXT
      ? [cloneTreeNode(sourceNode)]
      : (sourceNode.children || []).map(node => cloneTreeNode(node))
  );

  if (node.isContentNode) {
    component = updatePCNodeMetadata(sourceNode.metadata, component);
    sourceNode = updatePCNodeMetadata(
      {
        [PCVisibleNodeMetadataKey.BOUNDS]: undefined
      },
      sourceNode
    );
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
};

export const persistWrapInSlot = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  const sourceNode = getSyntheticSourceNode(node, state.graph);

  return state;
};

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

export const persistAddComponentController = <TState extends PCEditorState>(
  uri: string,
  target: SyntheticVisibleNode,
  state: TState
) => {
  let sourceNode = getSyntheticSourceNode(target, state.graph) as PCComponent;
  const sourceNodeDep = getPCNodeDependency(sourceNode.id, state.graph);

  let relativePath = path.relative(
    path.dirname(stripProtocol(sourceNodeDep.uri)),
    stripProtocol(uri)
  );
  if (relativePath.charAt(0) !== ".") {
    relativePath = "./" + relativePath;
  }

  sourceNode = {
    ...sourceNode,
    controllers: uniq(
      sourceNode.controllers
        ? [...sourceNode.controllers, relativePath]
        : [relativePath]
    )
  };

  return replaceDependencyGraphPCNode(sourceNode, sourceNode, state);
};

export const persistRemoveComponentController = <TState extends PCEditorState>(
  relativePath: string,
  target: SyntheticVisibleNode,
  state: TState
) => {
  let sourceNode = getSyntheticSourceNode(target, state.graph) as PCComponent;
  sourceNode = {
    ...sourceNode,
    controllers: arraySplice(
      sourceNode.controllers,
      sourceNode.controllers.indexOf(relativePath),
      1
    )
  };

  return replaceDependencyGraphPCNode(sourceNode, sourceNode, state);
};

/**
 * Synchronizes updated documents from the runtime engine. Updates are likely to be _behind_ in terms of
 * changes, so the editor state is the source of truth for the synthetic document to ensure that it doesn't
 * get clobbered with a previous version (which will cause bugs).
 */

export const syncSyntheticDocuments = <TState extends PCEditorState>(
  updatedDocuments: SyntheticDocument[],
  state: TState
) => {
  const staleDocumentMap: {
    [identifier: string]: SyntheticDocument;
  } = state.documents.reduce(
    (map, document: SyntheticDocument) => ({
      ...map,
      [document.id]: document
    }),
    {}
  );

  state = {
    ...(state as any),
    documents: updatedDocuments.map(document => {
      const existingDocument = staleDocumentMap[document.id];
      if (existingDocument) {
        // if checksum exists, then the client is a head of the document being synced
        if (existingDocument.checksum === document.checksum) {
          return existingDocument;

          // otherwise, use the fail safe for syncing documents
        } else {
          console.warn(`Checksum mismatch, patching synthetic document`);
          const patchedDocument = setDocumentChecksum(
            patchTreeNode(
              diffTreeNode(existingDocument, document),
              existingDocument
            )
          );

          if (patchedDocument.checksum !== document.checksum) {
            throw new Error(`Document checksum malformed.`);
          }

          // assert checksum match
          return patchedDocument;
        }
      }
      return document;
    })
  };

  return upsertFrames(state);
};

export const persistInsertNode = <TState extends PCEditorState>(
  newChild: PCVisibleNode | PCComponent,
  relative: SyntheticVisibleNode | SyntheticDocument,
  offset: TreeMoveOffset,
  state: TState
) => {
  let parentSource: PCVisibleNode;

  if (getPCNodeModule(newChild.id, state.graph)) {
    // remove the child first
    state = replaceDependencyGraphPCNode(null, newChild, state);
  }

  if (isSyntheticDocument(relative)) {
    parentSource = appendChildNode(newChild, getSyntheticSourceNode(
      relative,
      state.graph
    ) as PCVisibleNode);
  } else {
    let parent: SyntheticVisibleNode;
    let index: number;
    if (offset === TreeMoveOffset.APPEND || offset === TreeMoveOffset.PREPEND) {
      parent = relative as SyntheticVisibleNode;
      index = offset === TreeMoveOffset.PREPEND ? 0 : parent.children.length;
    } else {
      const document = getSyntheticVisibleNodeDocument(
        relative.id,
        state.documents
      );

      // reset reative so that we can fetch the index
      relative = getSyntheticNodeById(relative.id, state.documents);
      parent = getParentTreeNode(relative.id, document);
      index =
        parent.children.indexOf(relative) +
        (offset === TreeMoveOffset.BEFORE ? 0 : 1);
    }

    parentSource = maybeOverride(
      PCOverridablePropertyName.CHILDREN,
      newChild,
      null,
      (child, override?: PCOverride) => {
        return override
          ? arraySplice(override.children, index, 0, newChild)
          : [newChild];
      },
      (parent, value) => insertChildNode(value, index, parent)
    )(parent, state.documents, state.graph);
  }

  return replaceDependencyGraphPCNode(parentSource, parentSource, state);
};

export const persistAddVariant = <TState extends PCEditorState>(
  contentNode: SyntheticVisibleNode,
  state: TState
): TState => {
  const component = getSyntheticSourceNode(contentNode, state.graph);
  state = replaceDependencyGraphPCNode(
    appendChildNode(createPCVariant(null, true), component),
    component,
    state
  );
  return state;
};

export const persistRemoveVariant = <TState extends PCEditorState>(
  variant: PCVariant,
  state: TState
): TState => {
  const module = getPCNodeModule(variant.id, state.graph);
  state = replaceDependencyGraphPCNode(
    removeNestedTreeNode(variant, module),
    module,
    state
  );
  return state;
};

export const persistUpdateVariant = <TState extends PCEditorState>(
  properties: Partial<PCVariant>,
  variant: PCVariant,
  state: TState
): TState => {
  state = replaceDependencyGraphPCNode(
    { ...variant, ...properties },
    variant,
    state
  );
  return state;
};

export const persistToggleVariantDefault = <TState extends PCEditorState>(
  instance: SyntheticInstanceElement,
  targetVariantId: string,
  variant: PCVariant,
  state: TState
): TState => {
  const node = maybeOverride(
    PCOverridablePropertyName.VARIANT_IS_DEFAULT,
    null,
    variant,
    (value, override) => {
      return !instance.variant[targetVariantId];
    },
    (node: PCVariant) => ({ ...node, isDefault: !node.isDefault })
  )(instance, state.documents, state.graph, targetVariantId);
  state = replaceDependencyGraphPCNode(node, node, state);
  return state;
};
export const persistRemoveVariantOverride = <TState extends PCEditorState>(
  instance: SyntheticInstanceElement,
  targetVariantId: string,
  variant: PCVariant,
  state: TState
): TState => {
  const override = getInheritedAndSelfOverrides(
    instance,
    getSyntheticVisibleNodeDocument(instance.id, state.documents),
    state.graph,
    variant && variant.id
  ).find(override => last(override.targetIdPath) === targetVariantId);
  return replaceDependencyGraphPCNode(null, override, state);
};

export const persistInheritStyle = <TState extends PCEditorState>(
  inheritStyle: InheritStyle,
  node: SyntheticVisibleNode,
  variant: PCVariant,
  state: TState
) => {
  const sourceNode = maybeOverride(
    PCOverridablePropertyName.INHERIT_STYLE,
    inheritStyle,
    variant,
    (value, override) => {
      const prevStyle = (override && override.value) || EMPTY_OBJECT;
      return overrideKeyValue(node.style, prevStyle, {
        ...prevStyle,
        ...value
      });
    },
    (node: PCBaseVisibleNode<any>) => ({
      ...node,
      inheritStyle: {
        ...(node.inheritStyle || EMPTY_OBJECT),
        ...inheritStyle
      }
    })
  )(node, state.documents, state.graph);

  state = replaceDependencyGraphPCNode(sourceNode, sourceNode, state);

  return state;
};

export const persistInheritStyleComponentId = <TState extends PCEditorState>(
  oldComponentId: string,
  newComponentId: string,
  node: SyntheticVisibleNode,
  variant: PCVariant,
  state: TState
) => {
  const sourceNode = maybeOverride(
    PCOverridablePropertyName.INHERIT_STYLE,
    null,
    variant,
    (value, override) => {
      const prevStyle = (override && override.value) || EMPTY_OBJECT;
      return overrideKeyValue(node.style, prevStyle, {
        ...prevStyle,
        [oldComponentId]: undefined,
        [newComponentId]: prevStyle[oldComponentId] || { priority: 0 }
      });
    },
    (node: PCBaseVisibleNode<any>) => ({
      ...node,
      inheritStyle: {
        ...(node.inheritStyle || EMPTY_OBJECT),
        [oldComponentId]: undefined,
        [newComponentId]: node.inheritStyle[oldComponentId]
      }
    })
  )(node, state.documents, state.graph);

  state = replaceDependencyGraphPCNode(sourceNode, sourceNode, state);

  return state;
};

export const persistAppendPCClips = <TState extends PCEditorState>(
  clips: PCNodeClip[],
  target: SyntheticVisibleNode | SyntheticDocument,
  offset: TreeMoveOffset,
  state: TState
): TState => {
  const targetSourceNode = getSyntheticSourceNode(target, state.graph);
  const targetDep = getPCNodeDependency(targetSourceNode.id, state.graph);
  const parentSourceNode: PCNode =
    offset === TreeMoveOffset.BEFORE || offset === TreeMoveOffset.AFTER
      ? getParentTreeNode(targetSourceNode.id, targetDep.content)
      : targetSourceNode;
  const insertIndex =
    offset === TreeMoveOffset.BEFORE
      ? parentSourceNode.children.indexOf(targetSourceNode)
      : offset === TreeMoveOffset.AFTER
        ? parentSourceNode.children.indexOf(targetSourceNode) + 1
        : offset === TreeMoveOffset.APPEND
          ? parentSourceNode.children.length
          : 0;

  const targetNodeIsModule = parentSourceNode === targetDep.content;

  let content = targetDep.content;

  for (const { uri, node, fixedBounds } of clips) {
    const sourceNode = node;

    // If there is NO source node, then possibly create a detached node and add to target component
    if (!sourceNode) {
      throw new Error("not implemented");
    }

    // is component
    if (sourceNode.name === PCSourceTagNames.COMPONENT) {
      const componentInstance = createPCComponentInstance(sourceNode.id);

      if (targetNodeIsModule) {
        content = insertChildNode(
          updatePCNodeMetadata(
            {
              [PCVisibleNodeMetadataKey.BOUNDS]: shiftBounds(
                fixedBounds,
                PASTED_FRAME_OFFSET
              )
            },
            componentInstance
          ),
          insertIndex,
          content
        );
      } else {
        content = replaceNestedNode(
          insertChildNode(componentInstance, insertIndex, parentSourceNode),
          parentSourceNode.id,
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
        insertChildNode(clonedChild, insertIndex, parentSourceNode),
        parentSourceNode.id,
        content
      );
    }
  }

  state = replaceDependencyGraphPCNode(content, content, state);

  return state;
};

export const persistChangeSyntheticTextNodeValue = <
  TState extends PCEditorState
>(
  value: string,
  node: SyntheticTextNode,
  state: TState
) => {
  const updatedNode = maybeOverride(
    PCOverridablePropertyName.TEXT,
    value,
    null,
    identity,
    (sourceNode: PCTextNode) => ({
      ...sourceNode,
      value
    })
  )(node, state.documents, state.graph);

  state = replaceDependencyGraphPCNode(updatedNode, updatedNode, state);
  return state;
};

export const persistChangeElementType = <TState extends PCEditorState>(
  value: string,
  node: SyntheticElement,
  state: TState
) => {
  let sourceNode = getSyntheticSourceNode(node, state.graph) as PCElement;
  sourceNode = {
    ...sourceNode,
    is: value
  };
  state = replaceDependencyGraphPCNode(sourceNode, sourceNode, state);
  return state;
};

// TODO: test me, I'm complicated D:
const maybeOverride = (
  propertyName: PCOverridablePropertyName,
  value: any,
  variant: PCVariant,
  mapOverride: (value, override) => any,
  updater: (node: PCNode, value: any) => any
) => <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  documents: SyntheticDocument[],
  graph: DependencyGraph,
  targetSourceId: string = node.source.nodeId
): PCVisibleNode => {
  const sourceNode = getPCNode(targetSourceId, graph) as PCVisibleNode;
  const contentNode = getSyntheticContentNode(node, documents);
  if (!contentNode) {
    return updater(sourceNode, value);
  }
  const contentSourceNode = getSyntheticSourceNode(contentNode, graph);
  const variantId =
    variant &&
    getNestedTreeNodeById(variant.id, contentSourceNode) &&
    variant.id;
  const defaultVariantIds = isComponent(contentSourceNode)
    ? getPCVariants(contentSourceNode)
        .filter(variant => variant.isDefault)
        .map(variant => variant.id)
    : [];
  const variantOverrides = filterNestedNodes(
    contentSourceNode,
    node =>
      isPCOverride(node) && defaultVariantIds.indexOf(node.variantId) !== -1
  ).filter(
    (override: PCOverride) =>
      last(override.targetIdPath) === sourceNode.id ||
      (override.targetIdPath.length === 0 &&
        sourceNode.id === contentSourceNode.id)
  );

  if (
    node.immutable ||
    variantId ||
    variantOverrides.length ||
    targetSourceId !== node.source.nodeId
  ) {
    const document = getSyntheticVisibleNodeDocument(node.id, documents);

    const nearestComponentInstances = getNearestComponentInstances(
      node,
      document
    );

    const mutableInstance: SyntheticVisibleNode = nearestComponentInstances.find(
      instance => !instance.immutable
    );

    const mutableInstanceSourceNode = getSyntheticSourceNode(
      mutableInstance,
      graph
    ) as PCVisibleNode;

    // source node is an override, so go through the normal updater
    // if (getNestedTreeNodeById(sourceNode.id, furthestInstanceSourceNode)) {
    //   return updater(sourceNode, value);
    // }

    let overrideIdPath = uniq([
      ...nearestComponentInstances
        .slice(0, nearestComponentInstances.indexOf(mutableInstance))
        .reverse()
        .map((node: SyntheticVisibleNode) => node.source.nodeId)
    ]);

    if (
      sourceNode.id !== contentSourceNode.id &&
      !(
        overrideIdPath.length === 0 &&
        sourceNode.id === mutableInstanceSourceNode.id
      )
    ) {
      overrideIdPath.push(sourceNode.id);
    }

    // ensure that we skip overrides
    overrideIdPath = overrideIdPath.filter((id, index, path: string[]) => {
      // is the target
      if (index === path.length - 1) {
        return true;
      }

      return !getNestedTreeNodeById(path[index + 1], getPCNode(id, graph));
    });

    let existingOverride = mutableInstanceSourceNode.children.find(
      (child: PCOverride) => {
        return (
          child.name === PCSourceTagNames.OVERRIDE &&
          child.targetIdPath.join("/") === overrideIdPath.join("/") &&
          child.propertyName === propertyName &&
          (!variantId || child.variantId == variantId)
        );
      }
    ) as PCOverride;

    value = mapOverride(value, existingOverride);

    if (existingOverride) {
      if (value == null) {
        return removeNestedTreeNode(
          existingOverride,
          mutableInstanceSourceNode
        );
      }
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
        mutableInstanceSourceNode
      );
    } else if (node.immutable || variantId || node.id !== targetSourceId) {
      const override = createPCOverride(
        overrideIdPath,
        propertyName,
        value,
        variantId
      );
      return appendChildNode(override, mutableInstanceSourceNode);
    }
  }

  return updater(sourceNode, value);
};

export const persistSyntheticVisibleNodeBounds = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  const document = getSyntheticVisibleNodeDocument(node.id, state.documents);
  if (node.isContentNode) {
    const frame = getSyntheticVisibleNodeFrame(node, state.frames) as Frame;
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
};

// aias for inserting node
export const persistMoveSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  newRelative: SyntheticVisibleNode | SyntheticDocument,
  offset: TreeMoveOffset,
  state: TState
) => {
  const sourceNode = getSyntheticSourceNode(node, state.graph);

  return persistInsertNode(sourceNode, newRelative, offset, state);
};

export const persistSyntheticNodeMetadata = <TState extends PCEditorState>(
  metadata: KeyValue<any>,
  node: SyntheticVisibleNode | SyntheticDocument,
  state: TState
) => {
  const oldState = state;
  if (isSyntheticVisibleNode(node)) {
    state = updateSyntheticVisibleNode(node, state, node => ({
      ...node,
      metadata: {
        ...node.metadata,
        ...metadata
      }
    }));
  }
  let sourceNode = getSyntheticSourceNode(node, state.graph);
  sourceNode = updatePCNodeMetadata(metadata, sourceNode);
  return replaceDependencyGraphPCNode(sourceNode, sourceNode, state);
};

const addBoundsMetadata = (
  node: SyntheticVisibleNode,
  child: PCVisibleNode | PCComponent,
  state: PCEditorState
) => {
  const frame = getSyntheticVisibleNodeFrame(node, state.frames);
  const syntheticNodeBounds = getSyntheticVisibleNodeRelativeBounds(
    node,
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
  variant: PCVariant,
  state: TState
) =>
  persistSyntheticVisibleNodeStyle(
    parseStyle(text || ""),
    node,
    variant,
    state
  );

export const persistCSSProperty = <TState extends PCEditorState>(
  name: string,
  value: string,
  node: SyntheticVisibleNode,
  variant: PCVariant,
  state: TState
) => {
  if (value === "") {
    value = undefined;
  }
  const updatedNode = maybeOverride(
    PCOverridablePropertyName.STYLE,
    { [name]: value },
    variant,
    (style, override) => {
      const prevStyle = (override && override.value) || EMPTY_OBJECT;
      return overrideKeyValue(node.style, prevStyle, {
        ...prevStyle,
        ...style
      });
    },
    (sourceNode: PCVisibleNode) =>
      ({
        ...sourceNode,
        style: {
          ...sourceNode.style,
          [name]: value
        }
      } as PCVisibleNode)
  )(node, state.documents, state.graph);

  return replaceDependencyGraphPCNode(updatedNode, updatedNode, state);
};

export const persistAttribute = <TState extends PCEditorState>(
  name: string,
  value: string,
  element: SyntheticElement,
  state: TState
) => {
  if (value === "") {
    value = undefined;
  }
  const updatedNode = maybeOverride(
    PCOverridablePropertyName.ATTRIBUTES,
    { [name]: value },
    null,
    (attributes, override) => {
      return overrideKeyValue(
        element.attributes,
        (override && override.value) || EMPTY_OBJECT,
        attributes
      );
    },
    (sourceNode: PCElement) =>
      ({
        ...sourceNode,
        attributes: {
          ...sourceNode.attributes,
          [name]: value
        }
      } as PCVisibleNode)
  )(element, state.documents, state.graph);

  return replaceDependencyGraphPCNode(updatedNode, updatedNode, state);
};

export const persistUpdatePropertyBinding = <TState extends PCEditorState>(
  properties: Partial<PCPropertyBinding>,
  index: number,
  node: SyntheticVisibleNode,
  state: TState
) => {
  let sourceNode = getSyntheticSourceNode(node, state.graph) as PCVisibleNode;
  const binding = { ...sourceNode.bind.properties[index], ...properties };
  sourceNode = {
    ...sourceNode,
    bind: {
      ...sourceNode.bind,
      properties: arraySplice(sourceNode.bind.properties, index, 1, binding)
    }
  };

  state = replaceDependencyGraphPCNode(sourceNode, sourceNode, state);
  return state;
};

export const persistRemovePropertyBinding = <TState extends PCEditorState>(
  index: number,
  node: SyntheticVisibleNode,
  state: TState
) => {
  let sourceNode = getSyntheticSourceNode(node, state.graph) as PCVisibleNode;
  sourceNode = {
    ...sourceNode,
    bind: {
      ...sourceNode.bind,
      properties: arraySplice(sourceNode.bind.properties, index, 1)
    }
  };

  state = replaceDependencyGraphPCNode(sourceNode, sourceNode, state);
  return state;
};
export const persistAddPropertyBinding = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  let sourceNode = getSyntheticSourceNode(node, state.graph) as PCVisibleNode;
  sourceNode = maybeAddPropertyBind(sourceNode);
  sourceNode = {
    ...sourceNode,
    bind: {
      ...sourceNode.bind,
      properties: [...sourceNode.bind.properties, EMPTY_OBJECT]
    }
  };

  state = replaceDependencyGraphPCNode(sourceNode, sourceNode, state);
  return state;
};

const maybeAddBind = (node: PCVisibleNode) => {
  if (node.bind) {
    return node;
  }
  return { ...node, bind: EMPTY_OBJECT };
};

const maybeAddPropertyBind = (node: PCVisibleNode) => {
  node = maybeAddBind(node);
  if (node.bind.properties) {
    return node;
  }
  return {
    ...node,
    bind: {
      ...node.bind,
      properties: EMPTY_ARRAY
    }
  };
};

export const persistSyntheticVisibleNodeStyle = <TState extends PCEditorState>(
  style: any,
  node: SyntheticVisibleNode,
  variant: PCVariant,
  state: TState
) => {
  // state = replaceSyntheticVisibleNode({ ...node, style: merge(node.style, style) }, node, state);
  // TODO - need to move
  const updatedNode = maybeOverride(
    PCOverridablePropertyName.STYLE,
    style,
    variant,
    (style, override) => {
      return overrideKeyValue(
        node.style,
        (override && override.value) || EMPTY_OBJECT,
        style
      );
    },
    sourceNode =>
      ({
        ...sourceNode,
        style
      } as PCVisibleNode)
  )(node, state.documents, state.graph);

  // todo - need to consider variants here
  return replaceDependencyGraphPCNode(updatedNode, updatedNode, state);
};

export const canRemoveSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  const sourceNode = getSyntheticSourceNode(node, state.graph);

  if (!isComponent(sourceNode)) {
    return true;
  }

  const instancesOfComponent = filterPCNodes(state.graph, node => {
    return (
      (isPCComponentInstance(node) || isComponent(node)) &&
      node.is === sourceNode.id
    );
  });

  return instancesOfComponent.length === 0;
};

export const persistRemoveSyntheticVisibleNode = <TState extends PCEditorState>(
  node: SyntheticVisibleNode,
  state: TState
) => {
  // if the node is immutable, then it is part of an instance, so override the
  // style instead
  if (node.immutable) {
    return persistSyntheticVisibleNodeStyle(
      { display: "none" },
      node,
      null,
      state
    );
  }

  state = removeSyntheticVisibleNode(node, state);
  const sourceNode = getPCNode(node.source.nodeId, state.graph);
  return replaceDependencyGraphPCNode(null, sourceNode, state);
};

const parseStyle = (source: string) => {
  const style = {};
  source.split(";").forEach(decl => {
    const [key, value] = decl.split(":");
    if (!key || !value) return;
    style[key.trim()] = value.trim();
  });
  return style;
};

const overrideKeyValue = (main, oldOverrides, newOverrides) => {
  const minOverrides = {};
  for (const key in newOverrides) {
    if (oldOverrides[key] != null || main[key] !== newOverrides[key]) {
      minOverrides[key] = newOverrides[key];
    }
  }
  return minOverrides;
};

// to be used only in tests
export const evaluateEditedStateSync = (state: PCEditorState) => {
  const documents: SyntheticDocument[] = [];
  for (const uri in state.graph) {
    const newDocument = evaluatePCModule(state.graph[uri].content, state.graph);
    const oldDocument = getSyntheticDocumentByDependencyUri(
      uri,
      state.documents,
      state.graph
    );
    documents.push(
      oldDocument
        ? patchTreeNode(diffTreeNode(oldDocument, newDocument), oldDocument)
        : newDocument
    );
  }

  state = upsertFrames({ ...state, documents });

  return state;
};
