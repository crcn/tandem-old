import {
  memoize,
  EMPTY_OBJECT,
  EMPTY_ARRAY,
  TreeNode,
  filterNestedNodes,
  createNodeNameMatcher,
  findNestedNode,
  Bounds,
  createTreeNode,
  generateUID,
  KeyValue,
  getNestedTreeNodeById,
  replaceNestedNode,
  removeNestedTreeNode
} from "tandem-common";
import { mapValues, merge } from "lodash";
import { Dependency, DependencyGraph, updateGraphDependency } from "./graph";

export const PAPERCLIP_MODULE_VERSION = "0.0.3";

/*------------------------------------------
 * CONSTANTS
 *-----------------------------------------*/

export enum PCSourceTagNames {
  MODULE = "module",
  COMPONENT = "component",
  TEMPLATE = "template",
  ELEMENT = "element",
  COMPONENT_INSTANCE = "component-instance",
  VARIANT = "variant",
  OVERRIDE = "override",
  TEXT = "text"
}

export enum PCOverridablePropertyName {
  TEXT = "text",
  CHILDREN = "children",
  VARIANT = "variant",
  STYLE = "style",
  ATTRIBUTES = "attributes"
}

export enum PCVisibleNodeMetadataKey {
  // defined when dropped into the root document
  BOUNDS = "bounds"
}

/*------------------------------------------
 * STATE
 *-----------------------------------------*/

type PCBaseSourceNode<TName extends PCSourceTagNames> = {
  children: PCBaseSourceNode<any>[];
  metadata: KeyValue<any>;
} & TreeNode<TName>;

export type PCDependency = Dependency<PCModule>;

export type PCModule = {
  version: string;
  children: Array<PCComponent | PCVisibleNode>;
} & PCBaseSourceNode<PCSourceTagNames.MODULE>;

export type PCComponent = {
  label?: string;
  container?: boolean;
  style: KeyValue<any>;
  attributes: KeyValue<string>;
  is?: string;
  children: Array<PCVisibleNode | PCVariant | PCOverride>;
} & PCBaseSourceNode<PCSourceTagNames.COMPONENT>;

export type PCVariant = {
  label: string;
  isDefault?: boolean;
} & PCBaseSourceNode<PCSourceTagNames.VARIANT>;

export type PCBaseOverride<TPropertyName extends PCOverridablePropertyName> = {
  propertyName: TPropertyName;
  targetIdPath: string[];
  variantId: string;
} & PCBaseSourceNode<PCSourceTagNames.OVERRIDE>;

export type PCBaseValueOverride<
  TPropertyName extends PCOverridablePropertyName,
  TValue
> = {
  value: TValue;
} & PCBaseOverride<TPropertyName>;

export type PCStyleOverride = PCBaseValueOverride<
  PCOverridablePropertyName.STYLE,
  KeyValue<any>
>;
export type PCTextOverride = PCBaseValueOverride<
  PCOverridablePropertyName.TEXT,
  string
>;
export type PCChildrenOverride = PCBaseOverride<
  PCOverridablePropertyName.CHILDREN
>;
export type PCAttributesOverride = PCBaseValueOverride<
  PCOverridablePropertyName.ATTRIBUTES,
  KeyValue<any>
>;
export type PCVariantOverride = PCBaseValueOverride<
  PCOverridablePropertyName.VARIANT,
  string[]
>;

export type PCVisibleNodeOverride = PCStyleOverride;
export type PCTextNodeOverride = PCVisibleNodeOverride | PCTextOverride;
export type PCParentOverride = PCVisibleNodeOverride | PCChildrenOverride;
export type PCElementOverride = PCAttributesOverride | PCParentOverride;
export type PCComponentInstanceOverride = PCElementOverride | PCVariantOverride;

export type PCOverride =
  | PCStyleOverride
  | PCTextOverride
  | PCChildrenOverride
  | PCAttributesOverride
  | PCVariantOverride;

export type PCBaseVisibleNode<TName extends PCSourceTagNames> = {
  label?: string;
  style: KeyValue<any>;
} & PCBaseSourceNode<TName>;

export type PCBaseElement<TName extends PCSourceTagNames> = {
  container?: boolean;
  is: string;
  attributes: KeyValue<string>;
  children: (PCBaseVisibleNode<any> | PCOverride)[];
} & PCBaseVisibleNode<TName>;

export type PCElement = PCBaseElement<PCSourceTagNames.ELEMENT>;

export type PCComponentInstanceElement = {
  variant: string[];
} & PCBaseElement<PCSourceTagNames.COMPONENT_INSTANCE>;

export type PCTextNode = {
  value: string;
} & PCBaseVisibleNode<PCSourceTagNames.TEXT>;

export type PCVisibleNode = PCElement | PCTextNode | PCComponentInstanceElement;
export type PCNode =
  | PCModule
  | PCComponent
  | PCVariant
  | PCOverride
  | PCVisibleNode;

/*------------------------------------------
 * FACTORIES
 *-----------------------------------------*/

export const createPCModule = (
  children: Array<PCComponent | PCVisibleNode> = []
): PCModule => ({
  id: generateUID(),
  name: PCSourceTagNames.MODULE,
  version: PAPERCLIP_MODULE_VERSION,
  children,
  metadata: {}
});

export const createPCComponent = (
  label?: string,
  is?: string,
  style?: KeyValue<string>,
  attributes?: KeyValue<string>,
  children: Array<PCVariant | PCVisibleNode | PCOverride> = []
): PCComponent => ({
  label,
  is: is || "div",
  style: style || EMPTY_OBJECT,
  attributes: attributes || EMPTY_OBJECT,
  id: generateUID(),
  name: PCSourceTagNames.COMPONENT,
  children: children || EMPTY_ARRAY,
  metadata: {}
});

export const createPCVariant = (
  label?: string,
  isDefault?: boolean
): PCVariant => ({
  id: generateUID(),
  name: PCSourceTagNames.VARIANT,
  label,
  isDefault,
  children: [],
  metadata: {}
});

export const createPCElement = (
  is: string = "div",
  style: KeyValue<any> = {},
  attributes: KeyValue<string> = {},
  children: (PCVisibleNode | PCOverride)[] = [],
  label?: string
): PCElement => ({
  id: generateUID(),
  label,
  is: is || "div",
  name: PCSourceTagNames.ELEMENT,
  attributes: attributes || {},
  style: style || {},
  children: children || [],
  metadata: {}
});

export const createPCComponentInstance = (
  is: string,
  variant?: string[],
  style: KeyValue<any> = {},
  attributes: KeyValue<string> = {},
  children: PCVisibleNode[] = []
): PCComponentInstanceElement => ({
  id: generateUID(),
  variant: variant || [],
  is: is || "div",
  name: PCSourceTagNames.COMPONENT_INSTANCE,
  attributes: attributes || {},
  style: style || {},
  children: children || [],
  metadata: {}
});

export const createPCTextNode = (
  value: string,
  label?: string
): PCTextNode => ({
  id: generateUID(),
  name: PCSourceTagNames.TEXT,
  label: label || value,
  value,
  style: {},
  children: [],
  metadata: {}
});

export const createPCOverride = (
  targetIdPath: string[],
  propertyName: PCOverridablePropertyName,
  value: any,
  variantId?: string
): PCOverride => {
  const id = generateUID();

  let children;

  if (propertyName === PCOverridablePropertyName.CHILDREN) {
    return {
      id,
      variantId,
      propertyName,
      targetIdPath,
      name: PCSourceTagNames.OVERRIDE,
      children: value || [],
      metadata: {}
    };
  }

  return {
    id,
    variantId,
    propertyName,
    targetIdPath,
    value,
    name: PCSourceTagNames.OVERRIDE,
    children: []
  } as PCBaseValueOverride<any, any>;
};

export const createPCDependency = (
  uri: string,
  module: PCModule
): Dependency<PCModule> => ({
  uri,
  originalContent: module,
  content: module
});

/*------------------------------------------
 * TYPE UTILS
 *-----------------------------------------*/

export const isVisibleNode = (node: PCNode) =>
  node.name === PCSourceTagNames.ELEMENT ||
  node.name === PCSourceTagNames.TEXT ||
  node.name === PCSourceTagNames.COMPONENT_INSTANCE;
export const isPCOverride = (node: PCNode) =>
  node.name === PCSourceTagNames.OVERRIDE;
export const isComponent = (node: PCNode) =>
  node.name === PCSourceTagNames.COMPONENT;

export const extendsComponent = (
  element: PCElement | PCComponent | PCComponentInstanceElement
) => element.is.length > 6;

export const assertValidPCModule = memoize((module: PCModule) => {
  if (!validatePCModule(module)) {
    throw new Error(`Malformed PC Module`);
  }
});

// TODO - use schema here instead
export const validatePCModule = (module: PCModule) => {
  if (
    module.name !== PCSourceTagNames.MODULE ||
    module.version !== PAPERCLIP_MODULE_VERSION ||
    module.metadata == null
  ) {
    return false;
  }
  return module.children.every(validateModuleChild);
};

const validateModuleChild = (child: PCVisibleNode | PCComponent) => {
  if (child.name === PCSourceTagNames.COMPONENT) {
    return validateComponent(child);
  } else {
    return validatePCVisibleNode(child);
  }
};

const validateComponent = (component: PCComponent) => {
  // TODO
  return true;
};

const validatePCVisibleNode = (child: PCVisibleNode) => {
  if (child.name === PCSourceTagNames.ELEMENT) {
    return validatePCElement(child);
  }
  return true;
};

const validatePCVisibleNodeChild = (child: PCVisibleNode | PCOverride) => {
  if (child.name === PCSourceTagNames.OVERRIDE) {
    switch (child.propertyName) {
      case PCOverridablePropertyName.CHILDREN: {
        return true;
      }
      case PCOverridablePropertyName.STYLE: {
        return typeof child.value === "object";
      }
      case PCOverridablePropertyName.TEXT: {
        return typeof child.value === "string";
      }
      case PCOverridablePropertyName.VARIANT: {
        return Array.isArray(child.value);
      }
      case PCOverridablePropertyName.ATTRIBUTES: {
        return typeof child.value === "object";
      }
    }
  } else {
    return validatePCVisibleNode(child as PCVisibleNode);
  }
};

const validatePCElement = (element: PCElement) => {
  // TODO - validate that style props are all camel case
  if (
    !element.style ||
    !element.attributes ||
    !element.is ||
    element.metadata == null
  ) {
    return false;
  }
  return element.children.every(validatePCVisibleNodeChild);
};

/*------------------------------------------
 * GETTERS
 *-----------------------------------------*/

export const getModuleComponents = memoize((root: PCModule): PCComponent[] =>
  root.children.reduce((components, contentNode) => {
    return contentNode.name === PCSourceTagNames.COMPONENT
      ? [...components, contentNode]
      : components;
  }, [])
);

export const getVisibleChildren = (node: PCVisibleNode | PCComponent) =>
  node.children.filter(isVisibleNode) as PCVisibleNode[];
export const getOverrides = (node: PCNode) =>
  node.children.filter(isPCOverride) as PCOverride[];

export const getPCImportedChildrenSourceUris = (
  { id: nodeId }: PCNode,
  graph: DependencyGraph
) => {
  const node = getPCNode(nodeId, graph);
  const imported = {};
  findNestedNode(node, (child: PCNode) => {
    const dep = getPCNodeDependency(child.id, graph);
    imported[dep.uri] = 1;
  });
  return Object.keys(imported);
};

export const getPCNodeDependency = memoize(
  (nodeId: string, graph: DependencyGraph) => {
    for (const uri in graph) {
      const dependency = graph[uri];
      if (getNestedTreeNodeById(nodeId, dependency.content)) {
        return dependency;
      }
    }
    return null;
  }
);

export const getPCNode = (nodeId: string, graph: DependencyGraph) => {
  const dep = getPCNodeDependency(nodeId, graph);
  return getNestedTreeNodeById(nodeId, dep.content) as PCNode;
};

export const getPCNodeModule = (nodeId: string, graph: DependencyGraph) => {
  return getPCNodeDependency(nodeId, graph).content;
};

export const getPCNodeContentNode = (nodeId: string, module: PCModule) => {
  return module.children.find(contentNode =>
    getNestedTreeNodeById(nodeId, contentNode)
  );
};

export const updatePCNodeMetadata = <TNode extends PCNode>(
  metadata: KeyValue<any>,
  node: TNode
): TNode => ({
  ...(node as any),
  metadata: {
    ...node.metadata,
    ...metadata
  }
});

export const getComponentTemplate = (component: PCComponent) =>
  component.children.find(isVisibleNode) as PCVisibleNode;

export const getComponentVariants = (component: PCComponent) =>
  component.children.filter(
    child => child.name === PCSourceTagNames.VARIANT
  ) as PCVariant[];

export const getDefaultVariantIds = (component: PCComponent) =>
  getComponentVariants(component)
    .filter(variant => variant.isDefault)
    .map(variant => variant.id);

export const getNodeSourceComponent = memoize(
  (node: PCComponentInstanceElement, graph: DependencyGraph) =>
    getPCNodeContentNode(node.name, getPCNodeModule(node.id, graph))
);

/*------------------------------------------
 * SETTERS
 *-----------------------------------------*/

export const replacePCNode = (
  newNode: PCNode,
  oldNode: PCNode,
  graph: DependencyGraph
) => {
  const dependency = getPCNodeDependency(oldNode.id, graph);
  return updateGraphDependency(
    {
      content: replaceNestedNode(newNode, oldNode.id, dependency.content)
    },
    dependency.uri,
    graph
  );
};
