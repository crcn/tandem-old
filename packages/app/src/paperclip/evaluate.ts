/**

TODO (in order of importance):

- render all components defined in a file
- attach source information to each node
- render all components loaded externally from other dependency
- component overrides

*/

import { TreeNode, getTeeNodePath, DEFAULT_NAMESPACE, TreeNodeAttributes } from "./tree";
import { getImports, getModuleInfo, Component, Module, Dependency, DependencyGraph, getNodeSourceComponent } from "./dsl";
import { SyntheticNodeSource, SyntheticBrowser, SyntheticNode, SyntheticObject, SyntheticObjectType, SyntheticWindow, createSyntheticElement, getSytheticNodeSource } from "./synthetic";
import { EMPTY_OBJECT } from "../common/utils";
import { pick } from "lodash";

export const EDITOR_NAMESPACE = "editor";
export const DEFAULT_COMPONENT_ELEMENT_NAME = "div";

export type EvaluateOptions = {
  entry: Dependency;
  graph: DependencyGraph;
};

export type EvaluationResult = {
  componentPreviews: SyntheticNode[]
};

export const evaluateDependencyEntry = ({ entry, graph }: EvaluateOptions): EvaluationResult => {
  const module = getModuleInfo(entry.content);
  return {
    componentPreviews: module.components.map(component => evaluateComponentPreview(component, module, entry, graph))
  };
};

const evaluateComponentPreview = (component: Component, module: Module, dependency: Dependency, graph: DependencyGraph) => {
  return evaluateComponent(component, {}, [], getSytheticNodeSource(component.source, dependency), module, dependency, graph);
};

const evaluateComponent = (component: Component, attributes: TreeNodeAttributes, children: TreeNode[], source: SyntheticNodeSource, module: Module, dependency, graph: DependencyGraph) => {
  const parentName = component.extends || DEFAULT_COMPONENT_ELEMENT_NAME;
  const template = component.template;
  
  // TODO - pass slots down
  // TODO - check for existing component extends:importName="component"
  return createSyntheticElement(parentName, {
    ...attributes,
    [DEFAULT_NAMESPACE]: {
      ...(attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT),
      ...pick(component.source.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT, "style"),
    }
  }, template.children.map(child => evaluateNode(child, module, dependency, graph)), source);
};

const evaluateNode = (node: TreeNode, module: Module, dependency: Dependency, graph: DependencyGraph) => {
  const component = getNodeSourceComponent(node, dependency, graph);

  if (component) {
    console.log("TODO!");
  }

  return createSyntheticElement(node.name, node.attributes, node.children.map(child => evaluateNode(child, module, dependency, graph)), getSytheticNodeSource(module.source, dependency));
};
