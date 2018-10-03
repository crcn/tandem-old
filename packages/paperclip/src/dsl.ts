import {
  memoize,
  EMPTY_OBJECT,
  EMPTY_ARRAY,
  TreeNode,
  filterNestedNodes,
  findNestedNode,
  generateUID,
  KeyValue,
  getNestedTreeNodeById,
  replaceNestedNode,
  reduceTree,
  filterTreeNodeParents,
  NodeFilter,
  flattenTreeNode,
  getTreeNodesByName
} from "tandem-common";
import { uniq, isEqual } from "lodash";
import { Dependency, DependencyGraph, updateGraphDependency } from "./graph";

export const PAPERCLIP_MODULE_VERSION = "0.0.5";

/*------------------------------------------
 * CONSTANTS
 *-----------------------------------------*/

export enum PCSourceTagNames {
  // the root node which contains all pc nodes
  MODULE = "module",

  // components are living UI that are exported to application code
  COMPONENT = "component",

  // Style mixins define re-usable groups of styles, and nested styles. Maybe
  // this later on: https://css-tricks.com/part-theme-explainer/
  STYLE_MIXIN = "style-mixin",

  // Variables define a single value (like colors) that can be used in any style property (and attributes later on)
  VARIABLE = "variable",
  ELEMENT = "element",
  COMPONENT_INSTANCE = "component-instance",
  VARIANT = "variant",

  // Slots are sections of components where text & elements can be inserted into
  SLOT = "slot",

  // Plugs provide content for slots
  PLUG = "plug",

  // An override is a node that overrides a specific property or style within a variant, or shadow.
  OVERRIDE = "override",

  TEXT = "text",

  // TOD
  INHERIT_STYLE = "inherit-style"
}

export enum PCOverridablePropertyName {
  TEXT = "text",
  CHILDREN = "children",
  INHERIT_STYLE = "inheritStyle",

  // DEPRECATED
  VARIANT_IS_DEFAULT = "isDefault",
  VARIANT = "variant",
  STYLE = "style",
  ATTRIBUTES = "attributes",
  LABEL = "label",
  SLOT = "slot",
  CONTENT = "content"
}

export const VOID_TAG_NAMES = [
  "area",
  "base",
  "basefont",
  "bgsound",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "image",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "nextid",
  "param",
  "source",
  "track",
  "wbr"
];

export enum PCVisibleNodeMetadataKey {
  // defined when dropped into the root document
  BOUNDS = "bounds"
}

export const COMPUTED_OVERRIDE_DEFAULT_KEY = "default";

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
  children: Array<PCComponent | PCVisibleNode | PCVariable | PCStyleMixin>;
} & PCBaseSourceNode<PCSourceTagNames.MODULE>;

export type PCComponentChild = PCVisibleNode | PCVariant | PCOverride | PCSlot;

export type PCComponent = {
  /**
   * Controller source files, can be any supported language, filtered by compile target.
   * Example: ["./component.tsx", "./component.vue.ts", "./component.php"]
   *
   * Note that controllers can wrap each other. For example:
   *
   * ["./enhancer.tsx", "./another-enhancer.tsx"]
   *
   * ./noather-enhancer.tsx in this base would wrap around ./enhancer.tsx, which would wrap around the
   * actual presentational component.
   *
   *
   * @type {string[]}
   */
  controllers?: string[];
  variant: KeyValue<boolean>;
  is?: string;
  children: PCComponentChild[];
} & PCBaseElement<PCSourceTagNames.COMPONENT>;

export type PCElementStyleMixin = {
  targetType: PCSourceTagNames.ELEMENT;
  children: PCBaseVisibleNode<any>[];
} & PCBaseVisibleNode<PCSourceTagNames.STYLE_MIXIN>;

export type PCTextStyleMixin = {
  targetType: PCSourceTagNames.TEXT;
  value: string;
} & PCBaseVisibleNode<PCSourceTagNames.STYLE_MIXIN>;

export type PCStyleMixin = PCElementStyleMixin | PCTextStyleMixin;

export type PCVariant = {
  label?: string;
  isDefault?: boolean;
} & PCBaseSourceNode<PCSourceTagNames.VARIANT>;

export type PCBaseOverride<TPropertyName extends PCOverridablePropertyName> = {
  propertyName: TPropertyName;
  targetIdPath: string[];
  variantId: string;
} & PCBaseSourceNode<PCSourceTagNames.OVERRIDE>;

export type PCSlot = {
  // export name
  label?: string;
} & PCBaseSourceNode<PCSourceTagNames.SLOT>;

export enum PCVariableType {
  UNIT = "unit",
  NUMBER = "number",
  COLOR = "color",
  FONT = "font"
}

export type PCVariable = {
  label?: string;
  type: PCVariableType;
  value?: string;
} & PCBaseSourceNode<PCSourceTagNames.VARIABLE>;

export type PCPlug = {
  slotId: string;
} & PCBaseSourceNode<PCSourceTagNames.PLUG>;

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
export type PCLabelOverride = PCBaseValueOverride<
  PCOverridablePropertyName.LABEL,
  string
>;
export type PCVariantOverride = PCBaseValueOverride<
  PCOverridablePropertyName.VARIANT_IS_DEFAULT,
  string[]
>;

export type PCVariant2Override = PCBaseValueOverride<
  PCOverridablePropertyName.VARIANT,
  string[]
>;

export type PCVisibleNodeOverride = PCStyleOverride | PCLabelOverride;
export type PCTextNodeOverride = PCVisibleNodeOverride | PCTextOverride;
export type PCParentOverride = PCVisibleNodeOverride | PCChildrenOverride;
export type PCElementOverride = PCAttributesOverride | PCParentOverride;
export type PCComponentInstanceOverride = PCElementOverride | PCVariantOverride;

export type PCOverride =
  | PCStyleOverride
  | PCTextOverride
  | PCChildrenOverride
  | PCAttributesOverride
  | PCVariantOverride
  | PCLabelOverride
  | PCVariant2Override;

export type InheritStyleItem = {
  priority: number;

  // not actually implemented het
  variantId?: string;
};

export type InheritStyle = {
  [identifier: string]: InheritStyleItem;
};

export type PCBaseVisibleNode<TName extends PCSourceTagNames> = {
  label?: string;
  style: KeyValue<any>;

  // DEPRECATED - used styleMixins instead
  inheritStyle?: InheritStyle;
} & PCBaseSourceNode<TName>;

export type PCBaseElementChild =
  | PCBaseVisibleNode<any>
  | PCOverride
  | PCSlot
  | PCPlug;

export type PCBaseElement<TName extends PCSourceTagNames> = {
  is: string;
  attributes: KeyValue<string>;
  children: PCBaseElementChild[];
} & PCBaseVisibleNode<TName>;

export type PCElement = PCBaseElement<PCSourceTagNames.ELEMENT>;

export type PCComponentInstanceChild = PCBaseElementChild | PCPlug;

export type PCComponentInstanceElement = {
  variant: KeyValue<boolean>;
} & PCBaseElement<PCSourceTagNames.COMPONENT_INSTANCE>;

export type PCTextNode = {
  value: string;
} & PCBaseVisibleNode<PCSourceTagNames.TEXT>;

export type PCVisibleNode = PCElement | PCTextNode | PCComponentInstanceElement;
export type PCTextLikeNode = PCTextNode | PCTextStyleMixin;
export type PCElementLinkNode =
  | PCElement
  | PCComponent
  | PCComponentInstanceElement
  | PCElementStyleMixin;
export type PCNode =
  | PCModule
  | PCComponent
  | PCVariant
  | PCOverride
  | PCVisibleNode
  | PCSlot
  | PCPlug
  | PCVariable
  | PCElementStyleMixin
  | PCTextStyleMixin;

export type PCComputedOverrideMap = {
  [COMPUTED_OVERRIDE_DEFAULT_KEY]: PCComputedOverrideVariantMap;

  // variant id
  [identifier: string]: PCComputedOverrideVariantMap;
};

export type PCComputedOverrideVariantMap = {
  // target node id
  [identifier: string]: PCComputedNoverOverrideMap;
};

export type PCComputedNoverOverrideMap = {
  overrides: PCOverride[];
  children: PCComputedOverrideVariantMap;
};

/*------------------------------------------
 * FACTORIES
 *-----------------------------------------*/

export const createPCModule = (
  children: Array<PCComponent | PCVisibleNode> = EMPTY_ARRAY
): PCModule => ({
  id: generateUID(),
  name: PCSourceTagNames.MODULE,
  version: PAPERCLIP_MODULE_VERSION,
  children,
  metadata: EMPTY_OBJECT
});

export const createPCComponent = (
  label?: string,
  is?: string,
  style?: KeyValue<string>,
  attributes?: KeyValue<string>,
  children?: PCComponentChild[],
  metadata?: any
): PCComponent => ({
  label,
  is: is || "div",
  style: style || EMPTY_OBJECT,
  attributes: attributes || EMPTY_OBJECT,
  id: generateUID(),
  name: PCSourceTagNames.COMPONENT,
  children: children || EMPTY_ARRAY,
  metadata: metadata || EMPTY_OBJECT,
  variant: EMPTY_OBJECT
});

export const getDerrivedPCLabel = (
  node: PCVisibleNode | PCComponent,
  graph: DependencyGraph
) => {
  let label: string = node.label;
  if (label) {
    return label;
  }
  let current = node;
  while (extendsComponent(current)) {
    current = getPCNode((current as PCComponent).is, graph) as PCComponent;
    label = current.label;
    if (label) {
      break;
    }
  }

  return label;
};

export const createPCTextStyleMixin = (
  style: KeyValue<string>,
  textValue: string,
  label?: string
): PCTextStyleMixin => ({
  id: generateUID(),
  name: PCSourceTagNames.STYLE_MIXIN,
  label,
  style,
  value: textValue,
  targetType: PCSourceTagNames.TEXT,
  children: EMPTY_ARRAY,
  metadata: EMPTY_OBJECT
});

export const createPCElementStyleMixin = (
  style: KeyValue<string>,
  label?: string
): PCElementStyleMixin => ({
  id: generateUID(),
  label,
  name: PCSourceTagNames.STYLE_MIXIN,
  style,
  targetType: PCSourceTagNames.ELEMENT,
  children: EMPTY_ARRAY,
  metadata: EMPTY_OBJECT
});

export const createPCVariant = (
  label?: string,
  isDefault?: boolean
): PCVariant => ({
  id: generateUID(),
  name: PCSourceTagNames.VARIANT,
  label,
  isDefault,
  children: EMPTY_ARRAY,
  metadata: EMPTY_OBJECT
});

export const createPCVariable = (
  label: string,
  type: PCVariableType,
  value?: string
): PCVariable => ({
  id: generateUID(),
  name: PCSourceTagNames.VARIABLE,
  value,
  label,
  type,
  children: EMPTY_ARRAY,
  metadata: EMPTY_OBJECT
});

export const createPCElement = (
  is: string = "div",
  style: KeyValue<any> = EMPTY_OBJECT,
  attributes: KeyValue<string> = EMPTY_OBJECT,
  children: PCBaseElementChild[] = EMPTY_ARRAY,
  label?: string,
  metadata?: KeyValue<any>
): PCElement => ({
  id: generateUID(),
  label,
  is: is || "div",
  name: PCSourceTagNames.ELEMENT,
  attributes: attributes || EMPTY_OBJECT,
  style: style || EMPTY_OBJECT,
  children: children || EMPTY_ARRAY,
  metadata: metadata || EMPTY_OBJECT
});

export const createPCComponentInstance = (
  is: string,
  style: KeyValue<any> = EMPTY_OBJECT,
  attributes: KeyValue<string> = EMPTY_OBJECT,
  children: PCComponentInstanceChild[] = EMPTY_ARRAY,
  metadata?: KeyValue<any>,
  label?: string
): PCComponentInstanceElement => ({
  id: generateUID(),
  is: is || "div",
  label,
  name: PCSourceTagNames.COMPONENT_INSTANCE,
  attributes: attributes || EMPTY_OBJECT,
  style: style || EMPTY_OBJECT,
  children: children || EMPTY_ARRAY,
  metadata: metadata || EMPTY_OBJECT,
  variant: EMPTY_OBJECT
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

export const createPCSlot = (
  defaultChildren?: PCBaseElementChild[]
): PCSlot => ({
  id: generateUID(),
  children: defaultChildren || EMPTY_ARRAY,
  metadata: EMPTY_OBJECT,
  name: PCSourceTagNames.SLOT
});

export const createPCPlug = (
  slotId: string,
  children?: PCBaseElementChild[]
): PCPlug => ({
  slotId,
  id: generateUID(),
  children: children || EMPTY_ARRAY,
  metadata: EMPTY_OBJECT,
  name: PCSourceTagNames.PLUG
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
  content: module
});

/*------------------------------------------
 * TYPE UTILS
 *-----------------------------------------*/

export const isValueOverride = (
  node: PCOverride
): node is PCBaseValueOverride<any, any> => {
  return node.propertyName !== PCOverridablePropertyName.CHILDREN;
};

export const isVisibleNode = (node: PCNode): node is PCVisibleNode =>
  node.name === PCSourceTagNames.ELEMENT ||
  node.name === PCSourceTagNames.TEXT ||
  node.name === PCSourceTagNames.STYLE_MIXIN ||
  isPCComponentInstance(node);
export const isPCOverride = (node: PCNode): node is PCOverride =>
  node.name === PCSourceTagNames.OVERRIDE;
export const isComponent = (node: PCNode): node is PCComponent =>
  node.name === PCSourceTagNames.COMPONENT;

export const isSlot = (node: PCNode): node is PCSlot =>
  node.name === PCSourceTagNames.SLOT;
export const isPCPlug = (node: PCNode): node is PCPlug =>
  node.name === PCSourceTagNames.PLUG;
export const isPCComponentInstance = (
  node: PCNode
): node is PCComponentInstanceElement =>
  node.name === PCSourceTagNames.COMPONENT_INSTANCE;
export const isPCComponentOrInstance = (node: PCNode) =>
  isPCComponentInstance(node) || isComponent(node);

export const extendsComponent = (element: PCNode) =>
  (element.name == PCSourceTagNames.COMPONENT ||
    element.name === PCSourceTagNames.COMPONENT_INSTANCE) &&
  element.is.length > 6 &&
  /\d/.test(element.is);

export const isTextLikePCNode = (node: PCNode) =>
  node.name === PCSourceTagNames.TEXT ||
  (node.name === PCSourceTagNames.STYLE_MIXIN &&
    node.targetType === PCSourceTagNames.TEXT);
export const isElementLikePCNode = (node: PCNode) =>
  node.name === PCSourceTagNames.ELEMENT ||
  node.name === PCSourceTagNames.COMPONENT ||
  node.name === PCSourceTagNames.COMPONENT_INSTANCE ||
  (node.name === PCSourceTagNames.STYLE_MIXIN &&
    node.targetType === PCSourceTagNames.ELEMENT);

/*------------------------------------------
 * GETTERS
 *-----------------------------------------*/

export const getModuleComponents = memoize(
  (root: PCModule): PCComponent[] =>
    root.children.reduce((components, contentNode) => {
      return contentNode.name === PCSourceTagNames.COMPONENT
        ? [...components, contentNode]
        : components;
    }, [])
);

export const getVisibleChildren = memoize(
  (node: PCNode) => node.children.filter(isVisibleNode) as PCVisibleNode[]
);

export const getVisibleOrSlotChildren = memoize(
  (node: PCNode) =>
    node.children.filter(
      child => isVisibleNode(child) || child.name === PCSourceTagNames.SLOT
    ) as PCVisibleNode[]
);
export const getOverrides = memoize(
  (node: PCNode) =>
    node.children
      .filter(isPCOverride)
      .sort(
        (a, b) =>
          a.propertyName === PCOverridablePropertyName.CHILDREN
            ? 1
            : a.variantId
              ? -1
              : b.propertyName === PCOverridablePropertyName.CHILDREN
                ? 0
                : 1
      ) as PCOverride[]
);

export const getPCVariants = memoize(
  (component: PCComponent | PCVisibleNode): PCVariant[] =>
    component.children.filter(
      child => child.name === PCSourceTagNames.VARIANT
    ) as PCVariant[]
);

export const getPCVariantOverrides = memoize(
  (
    instance: PCComponent | PCComponentInstanceElement,
    variantId: string
  ): PCVariantOverride[] =>
    instance.children.filter(
      override =>
        isPCOverride(override) &&
        override.propertyName ===
          PCOverridablePropertyName.VARIANT_IS_DEFAULT &&
        override.variantId == variantId
    ) as PCVariantOverride[]
);

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

export const getNativeComponentName = memoize(
  (
    { id }: PCElement | PCComponent | PCComponentInstanceElement,
    graph: DependencyGraph
  ) => {
    let current = getPCNode(id, graph) as PCComponent;
    while (extendsComponent(current)) {
      current = getPCNode(current.is, graph) as PCComponent;
    }
    return current.is;
  }
);

// export const getComponentProperties = (memoize)

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

export const getGlobalVariables = memoize(
  (graph: DependencyGraph): PCVariable[] => {
    return Object.values(graph).reduce(
      (variables, dependency: PCDependency) => {
        return [
          ...variables,
          ...dependency.content.children.filter(
            child => child.name === PCSourceTagNames.VARIABLE
          )
        ];
      },
      EMPTY_ARRAY
    );
  }
);

export const filterVariablesByType = memoize(
  (variables: PCVariable[], type: PCVariableType) => {
    return variables.filter(variable => variable.type === type);
  }
);

export const getInstanceSlots = memoize(
  (
    node: PCComponentInstanceElement | PCComponent,
    graph: DependencyGraph
  ): PCSlot[] => {
    if (!extendsComponent(node)) {
      return [];
    }
    return getComponentSlots(getPCNode(node.is, graph) as PCComponent, graph);
  }
);

export const getComponentSlots = memoize(
  (component: PCComponent, graph: DependencyGraph): PCSlot[] => {
    return flattenTreeNode(component).filter(isSlot);
  }
);

export const getInstanceSlotContent = memoize(
  (slotId: string, node: PCComponentInstanceElement | PCComponent) => {
    return node.children.find(
      child => isPCPlug(child) && child.slotId === slotId
    ) as PCPlug;
  }
);

let slotCount = 0;

export const addPCNodePropertyBinding = memoize(
  (
    node: PCVisibleNode | PCComponent,
    bindProperty: string,
    sourceProperty: string
  ) => {
    // TODO - assert that property binding does not exist
    // TODO
  }
);

export const getInstanceShadow = memoize(
  (
    instance: PCComponentInstanceElement,
    graph: DependencyGraph
  ): PCComponent => {
    return getPCNode(instance.is, graph) as PCComponent;
  }
);

export const getSlotPlug = memoize(
  (
    instance: PCComponent | PCComponentInstanceElement,
    slot: PCSlot
  ): PCPlug => {
    return instance.children.find(
      (child: PCNode) =>
        child.name === PCSourceTagNames.PLUG && child.slotId === slot.id
    ) as PCPlug;
  }
);

export const getInstanceExtends = memoize(
  (
    instance: PCComponentInstanceElement,
    graph: DependencyGraph
  ): PCComponent[] => {
    let current: PCComponent | PCComponentInstanceElement = instance;
    const components = [];

    while (current) {
      components.push((current = getPCNode(current.is, graph) as PCComponent));
    }

    return components;
  }
);

export const getPCNode = (nodeId: string, graph: DependencyGraph) => {
  const dep = getPCNodeDependency(nodeId, graph);
  if (!dep) {
    return null;
  }
  return getNestedTreeNodeById(nodeId, dep.content) as PCNode;
};

export const filterPCNodes = (
  graph: DependencyGraph,
  filter: NodeFilter<PCNode>
): PCNode[] => {
  const found = [];
  for (const uri in graph) {
    const dep = graph[uri];
    found.push(...filterNestedNodes(dep.content, filter));
  }

  return found;
};

export const isPCContentNode = (node: PCNode, graph: DependencyGraph) => {
  const module = getPCNodeModule(node.id, graph);
  return module.children.some(child => child.id === node.id);
};

export const getPCNodeModule = (
  nodeId: string,
  graph: DependencyGraph
): PCModule => {
  const dep = getPCNodeDependency(nodeId, graph);
  return dep && dep.content;
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

export const getAllPCComponents = memoize(
  (graph: DependencyGraph): PCComponent[] => {
    const components: PCComponent[] = [];

    for (const uri in graph) {
      const dep = graph[uri];
      components.push(
        ...getTreeNodesByName(PCSourceTagNames.COMPONENT, dep.content)
      );
    }

    return components;
  }
);

export const getAllStyleMixins = memoize(
  (
    graph: DependencyGraph,
    targetType?: PCSourceTagNames.TEXT | PCSourceTagNames.ELEMENT
  ): PCStyleMixin[] => {
    const mixins: PCStyleMixin[] = [];

    for (const uri in graph) {
      const dep = graph[uri];
      mixins.push(
        ...getTreeNodesByName(PCSourceTagNames.STYLE_MIXIN, dep.content).filter(
          (mixin: PCStyleMixin) => {
            return !targetType || mixin.targetType === targetType;
          }
        )
      );
    }

    return mixins;
  }
);

export const isVoidTagName = (name: string) =>
  VOID_TAG_NAMES.indexOf(name) !== -1;

export const getComponentRefIds = memoize(
  (node: PCNode): string[] => {
    return uniq(
      reduceTree(
        node,
        (iss: string[], node: PCNode) => {
          if (
            node.name === PCSourceTagNames.COMPONENT_INSTANCE ||
            (node.name === PCSourceTagNames.COMPONENT && extendsComponent(node))
          ) {
            iss = [...iss, node.is];
          }

          if ((node as PCVisibleNode).inheritStyle) {
            iss = [
              ...iss,
              ...Object.keys((node as PCVisibleNode).inheritStyle)
            ];
          }
          return iss;
        },
        []
      )
    );
  }
);

export const computePCNodeStyle = memoize(
  (
    node: PCVisibleNode | PCComponent | PCStyleMixin,
    componentRefs: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>
  ) => {
    if (!node.inheritStyle) {
      return computeStyleWithVars(node.style, varMap);
    }

    let style = {};

    const inheritStyleComponentIds = Object.keys(
      node.inheritStyle || EMPTY_OBJECT
    )
      .filter(key => node.inheritStyle[key])
      .sort((a, b) => {
        return node.inheritStyle[a].priority > node.inheritStyle[b].priority
          ? 1
          : -1;
      });
    for (let i = 0, { length } = inheritStyleComponentIds; i < length; i++) {
      const inheritComponent = componentRefs[inheritStyleComponentIds[i]];
      if (!inheritComponent) {
        continue;
      }
      Object.assign(
        style,
        computePCNodeStyle(inheritComponent, componentRefs, varMap)
      );
    }

    Object.assign(style, node.style);

    return computeStyleWithVars(style, varMap);
  }
);

export const getComponentGraphRefs = memoize(
  (node: PCNode, graph: DependencyGraph): PCComponent[] => {
    const allRefs: PCComponent[] = [];
    const refIds = getComponentRefIds(node);
    for (let i = 0, { length } = refIds; i < length; i++) {
      const component = getPCNode(refIds[i], graph) as PCComponent;
      if (!component) {
        continue;
      }
      allRefs.push(component);
      allRefs.push(...getComponentGraphRefs(component, graph));
    }
    return uniq(allRefs);
  }
);

export const pcNodeEquals = (a: PCNode, b: PCNode) => {
  if (!pcNodeShallowEquals(a, b)) {
    return false;
  }
  if (a.children.length !== b.children.length) {
    return false;
  }
  for (let i = a.children.length; i--; ) {
    if (!pcNodeEquals(a.children[i] as PCNode, b.children[i] as PCNode)) {
      return false;
    }
  }
};

const pcNodeShallowEquals = (a: PCNode, b: PCNode) => {
  if (a.name !== b.name) {
    return false;
  }

  switch (a.name) {
    case PCSourceTagNames.ELEMENT: {
      return elementShallowEquals(a, b as PCElement);
    }
    case PCSourceTagNames.COMPONENT_INSTANCE: {
      return componentInstanceShallowEquals(a, b as PCComponentInstanceElement);
    }
    case PCSourceTagNames.COMPONENT: {
      return componentShallowEquals(a, b as PCComponent);
    }
    case PCSourceTagNames.TEXT: {
      return textEquals(a, b as PCTextNode);
    }
    case PCSourceTagNames.OVERRIDE: {
      return overrideShallowEquals(a, b as PCOverride);
    }
  }
};

const overrideShallowEquals = (a: PCOverride, b: PCOverride) => {
  return (
    a.propertyName === b.propertyName &&
    (a as PCBaseValueOverride<any, any>).value ==
      (b as PCBaseValueOverride<any, any>).value &&
    isEqual(a.targetIdPath, b.targetIdPath)
  );
};

const textEquals = (a: PCTextNode, b: PCTextNode) => a.value === b.value;

const elementShallowEquals = (
  a: PCElement | PCComponent | PCComponentInstanceElement,
  b: PCElement | PCComponent | PCComponentInstanceElement
) => {
  return isEqual(a.attributes, b.attributes);
};

const componentInstanceShallowEquals = (
  a: PCComponentInstanceElement,
  b: PCComponentInstanceElement
) => {
  return elementShallowEquals(a, b);
};

const componentShallowEquals = (a: PCComponent, b: PCComponent) => {
  return elementShallowEquals(a, b) && isEqual(a.controllers, b.controllers);
};

const nodeAryToRefMap = memoize(
  <TItem extends PCNode>(refs: TItem[]): KeyValue<TItem> => {
    const componentRefMap = {};
    for (let i = 0, { length } = refs; i < length; i++) {
      const ref = refs[i];
      componentRefMap[ref.id] = ref;
    }

    return componentRefMap;
  }
);

export const getComponentGraphRefMap = memoize(
  (node: PCNode, graph: DependencyGraph): KeyValue<PCComponent> =>
    nodeAryToRefMap(getComponentGraphRefs(node, graph)) as KeyValue<PCComponent>
);

export const getStyleVariableRefMap = memoize(
  (node: PCNode, graph: DependencyGraph) =>
    nodeAryToRefMap(getStyleVariableGraphRefs(node, graph)) as KeyValue<
      PCVariable
    >
);

export const getVariableRefMap = memoize(
  (graph: DependencyGraph) =>
    nodeAryToRefMap(getGlobalVariables(graph)) as KeyValue<PCVariable>
);

export const getStyleVariableGraphRefs = memoize(
  (node: PCNode, graph: DependencyGraph) => {
    const allRefs: PCVariable[] = [];

    const refIds =
      isVisibleNode(node) || node.name === PCSourceTagNames.COMPONENT
        ? getNodeStyleRefIds(node.style)
        : isPCOverride(node) &&
          node.propertyName === PCOverridablePropertyName.STYLE
          ? getNodeStyleRefIds(node.value)
          : EMPTY_ARRAY;

    for (let i = 0, { length } = refIds; i < length; i++) {
      const variable = getPCNode(refIds[i], graph) as PCVariable;
      if (!variable) {
        continue;
      }
      allRefs.push(variable);
    }

    if ((node as PCVisibleNode).inheritStyle) {
      for (const styleMixinId in (node as PCVisibleNode).inheritStyle) {
        allRefs.push(
          ...getStyleVariableGraphRefs(getPCNode(styleMixinId, graph), graph)
        );
      }
    }

    for (let i = 0, { length } = node.children; i < length; i++) {
      const child = node.children[i];
      allRefs.push(...getStyleVariableGraphRefs(child, graph));
    }
    return uniq(allRefs);
  }
);

export const getPCParentComponentInstances = memoize(
  (node: PCNode, root: PCNode) => {
    const parents = filterTreeNodeParents(node.id, root, isPCComponentInstance);

    return parents;
  }
);

export const styleValueContainsCSSVar = (value: string) => {
  return value.indexOf(`--`) !== -1;
};

// not usable yet -- maybe with computed later on
export const getCSSVars = (value: string) => {
  return (value.match(/--[^\s]+/g) || EMPTY_ARRAY).map(v => v.substr(2));
};

// not usable yet -- maybe with computed later on
export const computeStyleWithVars = (
  style: KeyValue<string>,
  varMap: KeyValue<PCVariable>
) => {
  const expandedStyle = {};
  for (const key in style) {
    expandedStyle[key] = computeStyleValue(style[key], varMap);
  }
  return expandedStyle;
};

export const computeStyleValue = (
  value: string,
  varMap: KeyValue<PCVariable>
) => {
  if (value && String(value).indexOf("--") !== -1) {
    const cssVars = getCSSVars(value);
    for (const cssVar of cssVars) {
      var ref = varMap[cssVar];
      value = ref ? value.replace(`--${cssVar}`, ref.value) : value;
    }
  }

  return value;
};

export const getNodeStyleRefIds = memoize((style: KeyValue<string>) => {
  const refIds = {};
  for (const key in style) {
    const value = style[key];

    // value c
    if (value && String(value).indexOf("--") !== -1) {
      const cssVars = getCSSVars(value);
      for (const cssVar of cssVars) {
        refIds[cssVar] = 1;
      }
    }
  }
  return Object.keys(refIds);
});

export const filterNestedOverrides = memoize(
  (node: PCNode): PCOverride[] => filterNestedNodes(node, isPCOverride)
);

export const getOverrideMap = memoize((node: PCNode, includeSelf?: boolean) => {
  const map: PCComputedOverrideMap = {
    default: {}
  };

  const overrides = getOverrides(node);
  for (const override of overrides) {
    if (override.variantId && !map[override.variantId]) {
      map[override.variantId] = {};
    }

    let targetOverrides: any;

    if (
      !(targetOverrides =
        map[override.variantId || COMPUTED_OVERRIDE_DEFAULT_KEY])
    ) {
      targetOverrides = map[
        override.variantId || COMPUTED_OVERRIDE_DEFAULT_KEY
      ] = {};
    }

    const targetIdPath = [...override.targetIdPath];
    const targetId = targetIdPath.pop() || node.id;
    if (
      includeSelf &&
      override.targetIdPath.length &&
      !getNestedTreeNodeById(targetId, node)
    ) {
      targetIdPath.unshift(node.id);
    }

    for (const nodeId of targetIdPath) {
      if (!targetOverrides[nodeId]) {
        targetOverrides[nodeId] = {
          overrides: [],
          children: {}
        };
      }

      targetOverrides = targetOverrides[nodeId].children;
    }

    if (!targetOverrides[targetId]) {
      targetOverrides[targetId] = {
        overrides: [],
        children: {}
      };
    }

    targetOverrides[targetId].overrides.push(override);
  }

  return map;
});

export const flattenPCOverrideMap = memoize(
  (
    map: PCComputedOverrideVariantMap,
    idPath: string[] = [],
    flattened: KeyValue<PCOverride[]> = {}
  ): KeyValue<PCOverride[]> => {
    for (const nodeId in map) {
      flattened[[...idPath, nodeId].join(" ")] = map[nodeId].overrides;
      flattenPCOverrideMap(
        map[nodeId].children,
        [...idPath, nodeId],
        flattened
      );
    }
    return flattened;
  }
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
