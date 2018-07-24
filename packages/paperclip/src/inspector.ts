import {
  TreeNode,
  generateUID,
  EMPTY_ARRAY,
  arraySplice,
  getParentTreeNode,
  patchArray
} from "tandem-common";
import {
  PCModule,
  getPCNode,
  PCNode,
  extendsComponent,
  PCComponent,
  PCComponentInstanceElement,
  PCSourceTagNames,
  getInstanceSlots,
  PCSlot,
  getInstanceSlotContent,
  isVisibleNode
} from "./dsl";
import { DependencyGraph } from "./graph";
import { patchTreeNode, diffTreeNode } from "./ot";

export enum InspectorNodeName {
  ROOT = "root",
  SOURCE_REP = "source-rep",
  CONTENT = "content",
  SHADOW = "shadow"
}

export type BaseInspectorTreeNode<
  TName extends InspectorNodeName
> = {} & TreeNode<TName>;

export type RootInspectorNode = {
  children: SourceRepNode[];
} & BaseInspectorTreeNode<InspectorNodeName.ROOT>;

export type SourceRepNode = {
  sourceNodeId: string;
  children: InspectorNode[];
} & BaseInspectorTreeNode<InspectorNodeName.SOURCE_REP>;

export type ContentInspectorNode = {
  slotId: string;
  contentNodeId?: string;
} & BaseInspectorTreeNode<InspectorNodeName.CONTENT>;

export type ShadowInspectorNode = {
  componentId: string;
  instanceId: string;
  children: InspectorNode[];
} & BaseInspectorTreeNode<InspectorNodeName.SHADOW>;

export type InspectorNode =
  | RootInspectorNode
  | SourceRepNode
  | ContentInspectorNode
  | ShadowInspectorNode;

export const createRootInspector = (
  children?: InspectorNode[]
): RootInspectorNode => ({
  id: generateUID(),
  name: InspectorNodeName.ROOT,
  children: children || EMPTY_ARRAY
});

const createSourceRefInspector = (
  sourceNode: PCNode,
  graph: DependencyGraph
): SourceRepNode => {
  return {
    id: generateUID(),
    sourceNodeId: sourceNode.id,
    name: InspectorNodeName.SOURCE_REP,
    children: mapSourceRepChildren(sourceNode, graph)
  };
};

const createSlotContent = (
  slot: PCSlot,
  instance: PCComponentInstanceElement | PCComponent,
  graph: DependencyGraph
): ContentInspectorNode => {
  const slotContent = getInstanceSlotContent(slot.id, instance);
  return {
    id: generateUID(),
    slotId: slot.id,
    contentNodeId: slot.id,
    name: InspectorNodeName.CONTENT,
    children: slotContent
      ? mapSourceRepChildren(slotContent, graph)
      : EMPTY_ARRAY
  };
};

const createShadowInspector = (
  instance: PCComponent | PCComponentInstanceElement,
  graph: DependencyGraph
): ShadowInspectorNode => {
  const component = getPCNode(instance.is, graph);
  return {
    id: generateUID(),
    componentId: component.id,
    instanceId: instance.id,
    name: InspectorNodeName.SHADOW,
    children: mapSourceRepChildren(component, graph)
  };
};

const mapSourceRepChildren = (
  parent: PCNode,
  graph: DependencyGraph
): InspectorNode[] => {
  if (extendsComponent(parent)) {
    return [
      createShadowInspector(parent, graph),
      ...getInstanceSlots(parent, graph).map(mapSlot(parent, graph))
    ];
  } else {
    return parent.children
      .map(mapSourceRepChild(parent, graph))
      .filter(Boolean);
  }
};

const mapSourceRepChild = (parent: PCNode, graph: DependencyGraph) => (
  child: PCNode
) => {
  if (!isVisibleNode(child)) {
    return null;
  }

  return createSourceRefInspector(child, graph);
};

const mapSlot = (
  instance: PCComponentInstanceElement | PCComponent,
  graph: DependencyGraph
) => (slot: PCSlot): ContentInspectorNode => {
  return createSlotContent(slot, instance, graph);
};

export const addModuleInspector = (
  module: PCModule,
  root: RootInspectorNode,
  graph: DependencyGraph
) => {
  return {
    ...root,
    children: [...root.children, createSourceRefInspector(module, graph)]
  };
};

export const refreshInspector = (
  root: InspectorNode,
  graph: DependencyGraph
) => {
  // this is all really lazy code. Eventually we should just scan

  const now = Date.now();
  const newRoot = createRootInspector(
    root.children.map((child: SourceRepNode) => {
      return createSourceRefInspector(
        getPCNode(child.sourceNodeId, graph),
        graph
      );
    })
  );

  console.log("new root in ", Date.now() - now);

  return patchTreeNode(diffTreeNode(root, newRoot), root);
};
