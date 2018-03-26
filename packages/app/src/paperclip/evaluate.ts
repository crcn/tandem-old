/**

TODO (in order of importance):

- render all components defined in a file
- attach source information to each node
- render all components loaded externally from other dependency
- component overrides

*/

import { TreeNode, getTeeNodePath, DEFAULT_NAMESPACE, TreeNodeAttributes, getAttribute, generateTreeChecksum, removeNestedTreeNodeFromPath, removeNestedTreeNode, getParentTreeNode, updatedNestedNode } from "../common/state/tree";
import { getImports, getModuleInfo, Component, Module, Dependency, DependencyGraph, getNodeSourceComponent, getNodeSourceModule, getModuleComponent, getNodeSourceDependency, ComponentExtendsInfo, getImportedDependency, getDependencyModule, ComponentOverride, ComponentOverrideType, getNodeReference, DeleteChildOverride, InsertChildOverride, SetAttributeOverride, SetStyleOverride } from "./dsl";
import { SyntheticNodeSource, SyntheticBrowser, SyntheticNode, SyntheticObject, SyntheticObjectType, SyntheticWindow, createSyntheticElement, getSytheticNodeSource } from "./synthetic";
import { EMPTY_OBJECT, EMPTY_ARRAY, arraySplice, xmlToTreeNode, stringifyTreeNodeToXML } from "../common/utils";
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

const evaluateComponent = (component: Component, attributes: TreeNodeAttributes, children: TreeNode[], source: SyntheticNodeSource, id: string, module: Module, checksum: string, dependency, graph: DependencyGraph, overrides: ComponentOverride[] = EMPTY_ARRAY) => {
  const ext = component.extends || DEFAULT_EXTENDS;
  
  let template = component.template;

  const slots = {};

  for (const child of children) {
    const slotName = child.attributes[DEFAULT_NAMESPACE].slot;
    if (!slots[slotName]) {
      slots[slotName] = [];
    }
    slots[slotName].push(child);
  }


  if (template) {
    template = overrideComponentTemplate(template, overrides);
  }

  const syntheticChildren = template ? template.children.map((child, i) => evaluateNode(child, module, checksum + i, checksum, dependency, graph, slots)) : EMPTY_ARRAY;

  const syntheticAttributes = {
    ...attributes,
    [DEFAULT_NAMESPACE]: {
      ...(attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT),
      ...pick(template && template.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT, "style"),
    }
  };

  const extendsFromDependency = getImportedDependency(ext.namespace, dependency, graph);

  if (extendsFromDependency) {
    const extendsFromModule = getDependencyModule(extendsFromDependency);
    const extendsComponent = getModuleComponent(ext.tagName, extendsFromModule);

    if (extendsComponent) {

      // overrides passed in
      return evaluateComponent(extendsComponent, syntheticAttributes, syntheticChildren, source, id, extendsFromModule, checksum, extendsFromDependency, graph, component.overrides);
    }
  }
  
  // TODO - pass slots down
  // TODO - check for existing component extends:importName="component"
  return createSyntheticElement(ext.tagName, syntheticAttributes, syntheticChildren, source, id);
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
      const ref = getNodeReference(insertNodeOverride.beforeChild, template);
      const parent = getParentTreeNode(ref, template);
      const index = parent.children.indexOf(ref);
      template = updatedNestedNode(parent, template, (parent) => {
        return {
          ...parent,
          children: arraySplice(parent.children, index, 0, insertNodeOverride.child)
        };
      });      
    } else if (override.type === ComponentOverrideType.SET_ATTRIBUTE) {
      const setAttributeOverride = override as SetAttributeOverride;
      const ref = getNodeReference(setAttributeOverride.target, template);
      template = updatedNestedNode(ref, template, (ref) => {
        return {
          ...ref,
          attributes: {
            [setAttributeOverride.namespace]: {
              ...(ref.attributes[setAttributeOverride.namespace] || EMPTY_OBJECT),
              [setAttributeOverride.name]: setAttributeOverride.value
            }
          }
        };
      });
    } else if (override.type === ComponentOverrideType.SET_STYLE) {
      const setStyleOverride = override as SetStyleOverride;
      const ref = getNodeReference(setStyleOverride.target, template);
      template = updatedNestedNode(ref, template, (ref) => {
        return {
          ...ref,
          attributes: {
            [DEFAULT_NAMESPACE]: {
              ...(ref.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT),
              style: {
                ...((ref.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT).style || EMPTY_OBJECT),
                [setStyleOverride.name]: setStyleOverride.value
              }
            }
          }
        };
      });
    }
  }

  return template;
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