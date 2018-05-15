import { memoize, EMPTY_OBJECT, EMPTY_ARRAY, parseStyle } from "../common/utils";
import { TreeNode, filterNestedNodes, getAttribute, createNodeNameMatcher, DEFAULT_NAMESPACE, findNestedNode, Bounds, setNodeAttribute } from "../common/state";
import { DEFAULT_EXTENDS } from ".";
import { mapValues } from "lodash";

export const ROOT_MODULE_NAME = "module";

export type DependencyGraph = {
  [identifier: string]: Dependency
};

export enum PCSourceAttributeNames {
  CONTAINER = "container",
  CONTAINER_STORAGE = "container-keep",
  NATIVE_TYPE = "native-type",
  LABEL = "label",
  SLOT = "slot"
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

export enum ComponentOverrideType {
  DELETE_NODE,
  INSERT_NODE,
  MOVE_NODE,
  SET_ATTRIBUTE,
  SET_STYLE,
  DELETE_ATTRIBUTE
};

export type ComponentOverride = {
  type: ComponentOverrideType;
};

export type DeleteChildOverride = {
  target: string;
} & ComponentOverride;

export type InsertChildOverride = {
  child: TreeNode;
  beforeChild?: string;
} & ComponentOverride;

export type SetAttributeOverride = {
  target?: string;
  name: string;
  namespace?: string;
  value: string;
} & ComponentOverride;

export type SetStyleOverride = {
  target?: string;
  name: string;
  value: string;
} & ComponentOverride;

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

export const getModuleComponents = memoize((root: TreeNode): Component[] => filterNestedNodes(root, node => node.name === "component").map(getComponentInfo));

export const getComponentInfo = memoize((component: TreeNode): Component => {

  let ext: ComponentExtendsInfo;

  if (component.attributes.extends) {
    for (const namespace in component.attributes.extends) {
      ext = {
        namespace,
        tagName: component.attributes.extends[namespace]
      };
      break;
    }
  } else if ((component.attributes[DEFAULT_NAMESPACE] || EMPTY_OBJECT).extends) {
    ext = {
      namespace: DEFAULT_NAMESPACE,
      tagName: component.attributes[DEFAULT_NAMESPACE].extends
    }
  }

  const overrides = component.children.find(createNodeNameMatcher("overrides"));

  return {
    id: getAttribute(component, "id"),
    label: getAttribute(component, "label"),
    extends: ext,
    template: component.children.find(createNodeNameMatcher("template")),
    source: component,
    overrides: overrides ? overrides.children.map(getOverrideInfo) : EMPTY_ARRAY
  };
});

export const getModuleInfo = memoize((source: TreeNode): Module => ({
  source,
  imports: getImports(source),
  components: getModuleComponents(source),
}));

export const getImportedDependency = (namespace: string, dependency: Dependency, graph: DependencyGraph) => {
  const module = getModuleInfo(dependency.content);
  const importedPath = dependency.importUris[module.imports[namespace]];
  return importedPath ? graph[importedPath] : dependency;
};

export const getNodeSourceDependency = (node: TreeNode, currentDependency: Dependency, graph: DependencyGraph) => getImportedDependency(node.namespace, currentDependency, graph);

export const getDependencyModule = (dependency: Dependency) => getModuleInfo(dependency.content);

export const getNodeSourceModule = (node: TreeNode, dependency: Dependency, graph: DependencyGraph) => {
  const sourceDependency = getNodeSourceDependency(node, dependency, graph);
  return getModuleInfo(sourceDependency.content);
};

export const getModuleComponent = (componentId: string, module: Module) => module.components.find(component => component.id === componentId);

export const getNodeSourceComponent = memoize((node: TreeNode, dependency: Dependency, graph: DependencyGraph) => getModuleComponent(node.name, getNodeSourceModule(node, dependency, graph)));

export const getOverrideInfo = memoize((node: TreeNode): ComponentOverride => {
  switch(node.name) {
    case "delete-child": return {
      type: ComponentOverrideType.DELETE_NODE,
      target:  getAttribute(node, "target"),
    } as DeleteChildOverride;
    case "insert-child": return {
      type: ComponentOverrideType.INSERT_NODE,
      child: node.children[0],
      beforeChild: getAttribute(node, "before")
    } as InsertChildOverride;
    case "set-attribute": return {
      type: ComponentOverrideType.SET_ATTRIBUTE,
      target:  getAttribute(node, "target"),
      name: getAttribute(node, "name"),
      namespace: getAttribute(node, "namespace"),
      value: getAttribute(node, "value"),
    } as SetAttributeOverride;
    case "set-style": return {
      type: ComponentOverrideType.SET_STYLE,
      target:  getAttribute(node, "target"),
      name: getAttribute(node, "name"),
      value: getAttribute(node, "value"),
    } as SetAttributeOverride;
    default: {
      throw new Error(`Unknown override type ${node.name}`);
    }
  }
});

export const getNodeReference = memoize((refName: string, root: TreeNode) => findNestedNode(root, child => getAttribute(child, "ref") === refName));

export const updateGraphDependency = (properties: Partial<Dependency>, uri: string, graph: DependencyGraph) => ({
  ...graph,
  [uri]: {
    ...graph[uri],
    ...properties
  }
});

export const getDependents = memoize((uri: string, graph: DependencyGraph) => {

  const dependents = [];

  for (const depUri in graph) {
    if (depUri === uri) {
      continue;
    }

    const dep = graph[depUri];

    for (const relativePath in dep.importUris) {
      const importedUri = dep.importUris[relativePath];
      if (importedUri === uri) {
        dependents.push(dep);
        continue;
      }
    }
  }

  return dependents;
});

export const getModuleImportNamespace = (uri: string, moduleNode: TreeNode): string => {
  const info = getModuleInfo(moduleNode);
  for (const namespace in info.imports) {
    if (info.imports[namespace] === uri) {
      return namespace;
    }
  }
};

export const addModuleNodeImport = (uri: string, moduleNode: TreeNode) => {
  const namespace = getModuleImportNamespace(uri, moduleNode);
  if (namespace) return moduleNode;
  const imports = getImports(moduleNode);
  const importCount = Object.keys(imports).length;
  return {
    ...moduleNode,
    attributes: {
      xmlns: {
        ...imports,
        ["import" + importCount]: uri
      }
    }
  }
};