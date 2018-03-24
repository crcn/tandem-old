import { memoize } from "../common/utils";
import { TreeNode, filterNestedNodes, getAttributesWithNamespace, getAttributeValue, createNodeNameMatcher } from "./tree";

export const ROOT_MODULE_NAME = "module";

export type DependencyGraph = {
  [identifier: string]: Dependency
};

export type Dependency = {

  // URI used here since it could be a url
  uri: string;
  dirty?: boolean; // TRUE if the contents have changed
  originalContent: TreeNode;
  content: TreeNode;
  importUris: {
    [identifier: string]: string
  }
};

export type Module = {
  source: TreeNode;
  imports: ModuleImports;
  components: Component[];
};

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

export const getModuleInfo = memoize((source: TreeNode) => ({
  source,
  imports: getImports(source),
  components: getModuleComponents(source),
}));

/**
 */

export const getNodeSourceDependency = memoize((node: TreeNode, dependency: Dependency, graph: DependencyGraph) => {
  const module = getModuleInfo(dependency.content);
  const importedPath = dependency.importUris[module.imports[node.namespace]];
  return importedPath ? graph[importedPath] : dependency;
});

/**
 */

export const getNodeSourceModule = (node: TreeNode, dependency: Dependency, graph: DependencyGraph) => {
  const sourceDependency = getNodeSourceDependency(node, dependency, graph);
  return getModuleInfo(sourceDependency.content);
};

/**
 */

export const getNodeSourceComponent = memoize((node: TreeNode, dependency: Dependency, graph: DependencyGraph) => {
  const sourceModule = getNodeSourceModule(node, dependency, graph);
  return sourceModule && sourceModule.components.find(component => component.id === node.name);
});
