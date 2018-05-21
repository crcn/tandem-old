/**

TODO (in order of importance):

- render all components defined in a file
- attach source information to each node
- render all components loaded externally from other dependency
- component overrides

*/

import { TreeNode, DEFAULT_NAMESPACE, TreeNodeAttributes, getAttribute, generateTreeChecksum, removeNestedTreeNodeFromPath, removeNestedTreeNode, getParentTreeNode, updateNestedNode, setNodeAttribute } from "../common/state/tree";
import { getImports, getModuleInfo, Component, Module, Dependency, DependencyGraph, getNodeSourceComponent, getNodeSourceModule, getModuleComponent, getNodeSourceDependency, ComponentExtendsInfo, getImportedDependency, getDependencyModule, ComponentOverride, ComponentOverrideType, getNodeReference, DeleteChildOverride, InsertChildOverride, SetAttributeOverride, SetStyleOverride, getComponentInfo, PCSourceAttributeNames } from "./dsl";
import { SyntheticNodeSource, SyntheticBrowser, SyntheticNode, SyntheticObject, SyntheticObjectType, SyntheticWindow, createSyntheticElement, getSytheticNodeSource, SyntheticDocument, getSyntheticDocumentDependency, EDITOR_NAMESPACE, EditorAttributeNames } from "./synthetic";
import { EMPTY_OBJECT, EMPTY_ARRAY, arraySplice, memoize } from "../common/utils";
import { pick, merge } from "lodash";

export const DEFAULT_EXTENDS: ComponentExtendsInfo = {
  namespace: DEFAULT_NAMESPACE,
  tagName: "rectangle"
};


export type EvaluateOptions = {
  entry: Dependency;
  graph: DependencyGraph;
};

export type EvaluationResult = {
  documentNodes: SyntheticNode[]
};

type Slots = {
  [identifier: string]: TreeNode[]
};

type IDGenerator = () => string;

export const evaluateDependencyEntry = ({ entry, graph }: EvaluateOptions): EvaluationResult => {
  const module = getModuleInfo(entry.content);
  const checksum = generateTreeChecksum(entry.content);
  let i = 0;
  const generateId = () => checksum + (i++);
  return {
    documentNodes: entry.content.children.map((element, i) => evaluatRooteDocumentElement(element, entry, graph, generateId))
  };
};

export const evaluatRooteDocumentElement = (element: TreeNode, entry: Dependency, graph: DependencyGraph, generateId: IDGenerator) => {
  if (element.name === "component") {
    return evaluateRootDocumentComponent(element, entry, graph, generateId);
  } else {
    const synthetic = evaluateNode(element, getModuleInfo(entry.content), generateId, entry, graph, null);
    return setNodeAttribute(synthetic, "style", {
      ...(getAttribute(synthetic, "style") || EMPTY_OBJECT),
    }) as SyntheticNode;
  }
};

export const evaluateRootDocumentComponent = (componentNode: TreeNode, currentDependency: Dependency, graph: DependencyGraph, generateId: IDGenerator): SyntheticNode  => {
  const module = getModuleInfo(currentDependency.content);
  const dependency = getNodeSourceDependency(componentNode, currentDependency, graph);
  let element = _evaluateComponent(componentNode, {
    [DEFAULT_NAMESPACE]: {
      style: getAttribute(componentNode, "style")
    }
  }, [], getSytheticNodeSource(componentNode, dependency), generateId, module, dependency, graph, EMPTY_ARRAY, true);
  element = setNodeAttribute(element, EditorAttributeNames.IS_COMPONENT_INSTANCE, false, EDITOR_NAMESPACE);
  element = setNodeAttribute(element, EditorAttributeNames.IS_COMPONENT_ROOT, true, EDITOR_NAMESPACE);
  return element;
};

const _evaluateComponent = (componentNode: TreeNode, attributes: TreeNodeAttributes, children: TreeNode[], source: SyntheticNodeSource, generateId: IDGenerator, module: Module, dependency, graph: DependencyGraph, overrides: ComponentOverride[] = EMPTY_ARRAY, isRoot?: boolean, createdFromComponent?: boolean) => {
  const info = getComponentInfo(componentNode);
  const ext = info.extends || DEFAULT_EXTENDS;
  let template = info.template;

  const slots = {};

  for (const child of children) {
    const slotName = child.attributes[DEFAULT_NAMESPACE].slot;
    if (!slots[slotName]) {
      slots[slotName] = [];
    }
    slots[slotName].push(child);
  }
  const componentContainerName = info.source.attributes[DEFAULT_NAMESPACE][PCSourceAttributeNames.CONTAINER];

  const variants = (attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT)[PCSourceAttributeNames.VARIANTS];

  let syntheticChildren = slots[componentContainerName];

  if (!syntheticChildren) {
    template = info.states.reduce((template, state) => {
      return (variants ? variants.indexOf(state.name) !== -1 : isRoot && state.isDefault) ? overrideComponentTemplate(template, state.overrides) : template;
    }, template);

    syntheticChildren = template ? template.children.map((child, i) => evaluateNode(child, module, generateId, dependency, graph, slots, createdFromComponent)) : EMPTY_ARRAY;
  }

  const syntheticAttributes = merge({}, {
    [DEFAULT_NAMESPACE]: {
      label: getAttribute(componentNode, "label"),
      style: getAttribute(componentNode, "style"),
    },
    [EDITOR_NAMESPACE]: {
      [EditorAttributeNames.CREATED_FROM_COMPONENT]: createdFromComponent,
      [EditorAttributeNames.IS_COMPONENT_INSTANCE]: createdFromComponent
    }
  }, attributes);

  // TODO - pass slots down
  // TODO - check for existing component extends:importName="component"
  let element = createSyntheticElement(ext.tagName, syntheticAttributes, syntheticChildren, source, generateId());
  return element;
};

const overrideComponentTemplate = (template: TreeNode, overrides: ComponentOverride[]) => {
  for (let i = 0, {length} = overrides; i < length; i++) {
    const override = overrides[i];
    if (override.type === ComponentOverrideType.DELETE_NODE) {
      const deleteNodeOverride = override as DeleteChildOverride;
      const ref = getNodeReference(deleteNodeOverride.target, template);
      template = removeNestedTreeNode(ref, template);
    } else if (override.type === ComponentOverrideType.INSERT_NODE) {
      const insertNodeOverride = override as InsertChildOverride;
      const beforeRef = insertNodeOverride.beforeChild ? getNodeReference(insertNodeOverride.beforeChild, template) : template.children.length ? template.children[template.children.length - 1] : null;
      const parent = beforeRef ? getParentTreeNode(beforeRef.id, template) : template;
      const index = beforeRef ? parent.children.indexOf(beforeRef) : parent.children.length;
      template = updateNestedNode(parent, template, (parent) => ({
        ...parent,
        children: arraySplice(parent.children, index, 0, insertNodeOverride.child)
      }));
    } else if (override.type === ComponentOverrideType.SET_ATTRIBUTE) {
      const setAttributeOverride = override as SetAttributeOverride;
      const ref = getNodeReference(setAttributeOverride.target, template);
      template = updateNestedNode(ref, template, (ref) => setNodeAttribute(ref, setAttributeOverride.name, setAttributeOverride.value));
    } else if (override.type === ComponentOverrideType.SET_STYLE) {
      const setStyleOverride = override as SetStyleOverride;
      const ref = getNodeReference(setStyleOverride.target, template);
      template = updateNestedNode(ref, template, (ref) => {
        return setNodeAttribute(ref, "style", {
          ...(getAttribute(ref, "style") || EMPTY_OBJECT),
          [setStyleOverride.name]: setStyleOverride.value
        });
      });
    }
  }

  return template;
};

const evaluateNode = (node: TreeNode, module: Module, generateId: IDGenerator, dependency: Dependency, graph: DependencyGraph, slots: Slots = EMPTY_OBJECT, createdFromComponent?: boolean) => {

  const nodeDependency = getNodeSourceDependency(node, dependency, graph);
  const nodeModule = getModuleInfo(nodeDependency.content);
  const nodeComponent = getModuleComponent(node.name, nodeModule);

  let {children, attributes} = node;

  let tagName = node.name;
  let hasSlottedChildren = false;
  const containerName = getAttribute(node, PCSourceAttributeNames.CONTAINER);

  if (containerName) {
    const slotChildren = slots[containerName] || EMPTY_ARRAY;

    if (slotChildren.length > 0) {
      children = slotChildren;
      hasSlottedChildren = true;
    }
  }

  const children2 = hasSlottedChildren ? children : children.map((child, i) => evaluateNode(child, module, generateId, dependency, graph, slots, createdFromComponent));

  if (nodeComponent) {

    return _evaluateComponent(nodeComponent.source, node.attributes, children2, getSytheticNodeSource(node, dependency), generateId, nodeModule, nodeDependency, graph, EMPTY_ARRAY, false, true);
  }

  return createSyntheticElement(tagName, merge({}, attributes, {
    [EDITOR_NAMESPACE]: {
      [EditorAttributeNames.CREATED_FROM_COMPONENT]: createdFromComponent
    }
  }), children2, getSytheticNodeSource(node, dependency), generateId());
};