import { memoize, EMPTY_OBJECT } from "../common/utils";
import { TreeNode, filterNestedNodes, getAttribute, createNodeNameMatcher, DEFAULT_NAMESPACE } from "../common/state";
import { DEFAULT_EXTENDS } from ".";

export const ROOT_MODULE_NAME = "module";

export type DependencyGraph = {
  [identifier: string]: Dependency
};

// TODO - generic style 
export type StyleDeclaration = {
  left: number;
  top: number;
  width: number;
  height: number;
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

export type ComponentExtendsInfo = {
  namespace: string;
  tagName: string;
}

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

  extends?: ComponentExtendsInfo;

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
};

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
  return root.attributes.xmlns || EMPTY_OBJECT;
});

/**
 * Returns all components in a module
 */

export const getModuleComponents = memoize((root: TreeNode) => {
  const components: Component[] = [];

  filterNestedNodes(root, node => node.name === "component").forEach(source => {

    let ext: ComponentExtendsInfo;

    if (source.attributes.extends) {
      for (const namespace in source.attributes.extends) {
        ext = {
          namespace,
          tagName: source.attributes.extends[namespace]
        };
        break;
      }
    } else if ((source.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT).extends) {
      ext = {
        namespace: DEFAULT_NAMESPACE,
        tagName: source.attributes[DEFAULT_NAMESPACE].extends
      }
    }
    
    components.push({
      id: getAttribute(source, "id"),
      label: getAttribute(source, "label"),
      extends: ext,
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

export const getImportedDependency = (namespace: string, dependency: Dependency, graph: DependencyGraph) => {
  const module = getModuleInfo(dependency.content);
  const importedPath = dependency.importUris[module.imports[namespace]];
  return importedPath ? graph[importedPath] : dependency;
};

export const getNodeSourceDependency = (node: TreeNode, dependency: Dependency, graph: DependencyGraph) => getImportedDependency(node.namespace, dependency, graph);

export const getDependencyModule = (dependency: Dependency) => getModuleInfo(dependency.content);

export const getNodeSourceModule = (node: TreeNode, dependency: Dependency, graph: DependencyGraph) => {
  const sourceDependency = getNodeSourceDependency(node, dependency, graph);
  return getModuleInfo(sourceDependency.content);
};

export const getModuleComponent = (componentId: string, module: Module) => module.components.find(component => component.id === componentId);

export const getNodeSourceComponent = memoize((node: TreeNode, dependency: Dependency, graph: DependencyGraph) => getModuleComponent(node.name, getNodeSourceModule(node, dependency, graph)));
