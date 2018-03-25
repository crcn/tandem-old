/**

TODO (in order of importance):

- render all components defined in a file
- attach source information to each node
- render all components loaded externally from other dependency
- component overrides

*/

import { TreeNode, getTeeNodePath, DEFAULT_NAMESPACE, TreeNodeAttributes, getAttribute, generateTreeChecksum } from "./tree";
import { getImports, getModuleInfo, Component, Module, Dependency, DependencyGraph, getNodeSourceComponent, getNodeSourceModule, getModuleComponent, getNodeSourceDependency, ComponentExtendsInfo, getImportedDependency, getDependencyModule } from "./dsl";
import { SyntheticNodeSource, SyntheticBrowser, SyntheticNode, SyntheticObject, SyntheticObjectType, SyntheticWindow, createSyntheticElement, getSytheticNodeSource } from "./synthetic";
import { EMPTY_OBJECT, EMPTY_ARRAY } from "../common/utils";
import { pick } from "lodash";

export const EDITOR_NAMESPACE = "editor";
export const DEFAULT_EXTENDS: ComponentExtendsInfo = {
  namespace: DEFAULT_NAMESPACE,
  tagName: "div"
};

export type EvaluateOptions = {
  entry: Dependency;
  graph: DependencyGraph;
};

export type EvaluationResult = {
  componentPreviews: SyntheticNode[]
};

type Slots = {
  [identifier: string]: TreeNode[]
};

export const evaluateDependencyEntry = ({ entry, graph }: EvaluateOptions): EvaluationResult => {
  const module = getModuleInfo(entry.content);
  const checksum = generateTreeChecksum(entry.content);
  return {
    componentPreviews: module.components.map((component, i) => evaluateComponentPreview(component, module, checksum + i, checksum, entry, graph))
  };
};

const evaluateComponentPreview = (component: Component, module: Module, id: string, checksum: string, dependency: Dependency, graph: DependencyGraph) => {
  return evaluateComponent(component, {}, [], getSytheticNodeSource(component.source, dependency), id, module, checksum, dependency, graph);
};

const evaluateComponent = (component: Component, attributes: TreeNodeAttributes, children: TreeNode[], source: SyntheticNodeSource, id: string, module: Module, checksum: string, dependency, graph: DependencyGraph) => {
  const ext = component.extends || DEFAULT_EXTENDS;
  
  const template = component.template;

  const slots = {};

  for (const child of children) {
    const slotName = child.attributes[DEFAULT_NAMESPACE].slot;
    if (!slots[slotName]) {
      slots[slotName] = [];
    }
    slots[slotName].push(child);
  }

  const syntheticAttributes = {
    ...attributes,
    [DEFAULT_NAMESPACE]: {
      ...(attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT),
      ...pick(component.source.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT, "style"),
    }
  };

  const syntheticChildren = template.children.map((child, i) => evaluateNode(child, module, checksum + i, checksum, dependency, graph, slots));

  const extendsFromDependency = getImportedDependency(ext.namespace, dependency, graph);

  if (extendsFromDependency) {
    const extendsFromModule = getDependencyModule(extendsFromDependency);
    const extendsComponent = getModuleComponent(ext.tagName, extendsFromModule);

    if (extendsComponent) {
      return evaluateComponent(extendsComponent, syntheticAttributes, syntheticChildren, source, id, extendsFromModule, checksum, extendsFromDependency, graph);
    }
  }
  
  // TODO - pass slots down
  // TODO - check for existing component extends:importName="component"
  return createSyntheticElement(ext.tagName, syntheticAttributes, syntheticChildren, source, id);
};

const evaluateNode = (node: TreeNode, module: Module, id: string, checksum: string, dependency: Dependency, graph: DependencyGraph, slots: Slots = EMPTY_OBJECT) => {

  const nodeDependency = getNodeSourceDependency(node, dependency, graph);
  const nodeModule = getModuleInfo(nodeDependency.content);
  const nodeComponent = getModuleComponent(node.name, nodeModule);

  if (nodeComponent) {
    return evaluateComponent(nodeComponent, node.attributes, node.children, getSytheticNodeSource(node, dependency), id, nodeModule, checksum, nodeDependency, graph)
  }

  let children = node.children;
  let attributes = node.attributes;

  let tagName = node.name;

  if (tagName === "slot") {
    attributes = {};
    tagName = "span";
    const slotName = getAttribute(node, "name");

    const slotChildren = slots[slotName] || EMPTY_ARRAY;

    if (slotChildren.length > 0) {
      children = slotChildren;
    }
  }

  return createSyntheticElement(tagName, attributes, children.map((child, i) => evaluateNode(child, module, id + i, checksum, dependency, graph, slots)), getSytheticNodeSource(module.source, dependency), id);
};