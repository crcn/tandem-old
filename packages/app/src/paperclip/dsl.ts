import { memoize } from "common/utils";
import { TreeNode, filterNestedNodes, getAttributesWithNamespace, getAttributeValue, createNodeNameMatcher } from "./tree-state";

export const ROOT_MODULE_NAME = "module";

export enum ModuleType {
  COMPONENT,
  IMAGE
};

export type BaseModule = {
  type: ModuleType
}

// TODO 
export type ImageModule = {

}

export type ComponentModule = {
  imports: ModuleImports;
  components: Component[];
} & BaseModule;

export type Component = {

  /**
   * ID of the component (should reflect the label)
   */

  id: string;
  
  /** 
   * Human friendly label of the component
   */

  label?: string;

  /**
   * Extension of an existing component or a native element
   */

  extends?: string;

  /**
   * reference where all of this information is derrived from
   */

  source: TreeNode;

  /**
   */

  template: TreeNode;

  /**
   * Valid only if extending an existing component
   */

  overrides: ComponentOverride[];
}

export type ComponentOverride = {

}

export type ModuleImports = {
  [identifier: string]: string;
};

/**
 * returns all imports of a module. For example:
 * 
 * <module xmlns:main="./main-module"></module>
 */

export const getImports = memoize((root: TreeNode): ModuleImports => {
  if (root.name !== ROOT_MODULE_NAME) {
    throw new Error(`Root name must be module, "${root.name}" provided.`);
  }
  const imports = {};
  getAttributesWithNamespace(root, "xmlns").forEach(attr => {
    imports[attr.name] = attr.value;
  });

  return imports;
});

/**
 * Returns all components in a module
 */

export const getModuleComponents = memoize((root: TreeNode) => {
  const components: Component[] = [];

  filterNestedNodes(root, node => node.name === "component").forEach(source => {
    components.push({
      id: getAttributeValue(source, "id"),
      label: getAttributeValue(source, "label"),
      extends: getAttributeValue(source, "extends"),
      template: source.children.find(createNodeNameMatcher("template")),
      source,

      // TODO 
      overrides: []
    });
  });

  return components;
});

/**
 * 
 */

export const createComponentModule = memoize((root: TreeNode) => ({
  type: ModuleType.COMPONENT,
  imports: getImports(root),
  components: getModuleComponents(root),
});