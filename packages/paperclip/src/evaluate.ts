import * as path from "path";
import { DependencyGraph } from "./graph";
import {
  SyntheticElement,
  SyntheticVisibleNode,
  createSyntheticElement,
  createSytheticDocument,
  SyntheticSource,
  SyntheticTextNode,
  createSyntheticTextNode,
  createSyntheticInstanceElement
} from "./synthetic";
import {
  PCModule,
  getVisibleChildren,
  createPCDependency,
  PCOverridablePropertyName,
  PCVisibleNode,
  PCComponent,
  PCNode,
  PCSourceTagNames,
  PCElement,
  PCTextNode,
  PCComponentInstanceElement,
  extendsComponent,
  getComponentGraphRefMap,
  getOverrides,
  PCOverride,
  ComponentRef,
  getPCNodeDependency,
  getPCVariants,
  PCVariant,
  isComponent,
  InheritStyle,
  PCSlot,
  PCPlug,
  isVisibleNode,
  getVisibleOrSlotChildren
} from "./dsl";
import {
  KeyValue,
  memoize,
  stripProtocol,
  addProtocol,
  FILE_PROTOCOL,
  EMPTY_OBJECT
} from "tandem-common";

type EvalOverride = {
  [PCOverridablePropertyName.ATTRIBUTES]: KeyValue<any>;
  [PCOverridablePropertyName.STYLE]: KeyValue<any>;

  [PCOverridablePropertyName.CHILDREN]: SyntheticVisibleNode[];
  [PCOverridablePropertyName.VARIANT_IS_DEFAULT]: boolean;
  [PCOverridablePropertyName.INHERIT_STYLE]: InheritStyle;
  [PCOverridablePropertyName.TEXT]: string;
  [PCOverridablePropertyName.LABEL]: string;
};

type EvalOverrides = {
  // instance path
  [identifier: string]: EvalOverride;
};

type ComponentRefs = KeyValue<ComponentRef>;

// Note that I'd prefer immutability here, but that's just too damn slow
// for this function.

export const evaluatePCModule = memoize(
  (module: PCModule, graph: DependencyGraph) => {
    const documentChildren: SyntheticVisibleNode[] = new Array(
      module.children.length
    );
    for (let i = 0, { length } = module.children; i < length; i++) {
      const child = module.children[i];
      documentChildren[i] = evaluateContentNode(
        child,
        getComponentGraphRefMap(child, graph),
        getPCNodeDependency(module.id, graph).uri
      );
    }

    return createSytheticDocument(
      createSyntheticSource(module),
      documentChildren
    );
  }
);

export const evaluateLightPCVisibleNode = (node: PCVisibleNode) => {
  return evaluateVisibleNode(node, "", false, false, EMPTY_OBJECT, {}, {}, "");
};

const wrapModuleInDependencyGraph = (module: PCModule): DependencyGraph => ({
  [module.id]: createPCDependency(module.id, module)
});

const evaluateContentNode = memoize(
  (
    node: PCVisibleNode | PCComponent,
    componentMap: ComponentRefs,
    sourceUri: string
  ): SyntheticVisibleNode => {
    const overrides = {};
    let syntheticNode: SyntheticVisibleNode;
    if (node.name === PCSourceTagNames.COMPONENT) {
      syntheticNode = evaluateComponentInstance(
        node,
        node,
        null,
        null,
        false,
        true,
        EMPTY_OBJECT,
        overrides,
        componentMap,
        sourceUri
      );
    } else {
      syntheticNode = evaluateVisibleNode(
        node,
        null,
        false,
        false,
        EMPTY_OBJECT,
        overrides,
        componentMap,
        sourceUri
      );
    }
    syntheticNode.isContentNode = true;
    return syntheticNode;
  }
);

const evaluateComponentInstance = (
  node: PCComponent | PCComponentInstanceElement,
  instance: PCComponent | PCComponentInstanceElement,
  label: string,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  variant: KeyValue<boolean>,
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
): SyntheticElement => {
  const selfPath = appendPath(instancePath, instance.id);
  const isComponentInstance =
    instance.name === PCSourceTagNames.COMPONENT_INSTANCE;
  const childrenAreImmutable = immutable || node !== instance;

  const selfVariant = evaluateVariants(
    selfPath,
    getPCVariants(node),
    overrides
  );
  registerOverrides(
    node,
    instancePath,
    selfPath,
    childrenAreImmutable,
    true,
    variant,
    selfVariant,
    overrides,
    componentMap,
    sourceUri
  );

  if (extendsComponent(node)) {
    const ref = componentMap[node.is];
    return evaluateComponentInstance(
      ref.component,
      instance,
      null,
      instancePath,
      immutable,
      true,
      variant,
      overrides,
      componentMap,
      ref.sourceUri
    );
  }

  const children = overrides[selfPath] && overrides[selfPath].children;

  return createSyntheticInstanceElement(
    (node as PCComponentInstanceElement).is,
    createSyntheticSource(instance),
    evaluateStyle(node, selfPath, componentMap, overrides),
    selfVariant,
    evaluateAttributes(node, selfPath, overrides, sourceUri),
    children,
    evaluateLabel(instance, selfPath, overrides),
    false,
    isCreatedFromComponent,
    isComponentInstance,
    immutable,
    instance.metadata
  );
};

const evaluateStyle = (
  node: PCVisibleNode | PCComponent,
  selfPath: string,
  componentMap: ComponentRefs,
  overrides: EvalOverrides
) => {
  const style = {};
  const inheritStyle = {};

  if (node.inheritStyle) {
    Object.assign(inheritStyle, node.inheritStyle);
  }

  if (overrides[selfPath] && overrides[selfPath].inheritStyle) {
    Object.assign(inheritStyle, overrides[selfPath].inheritStyle);
  }

  const componentIds = Object.keys(inheritStyle)
    .filter(b => inheritStyle[b])
    .sort(
      (a, b) =>
        inheritStyle[a].priority > node.inheritStyle[b].priority ? 1 : -1
    );
  for (const componentId of componentIds) {
    if (!componentMap[componentId]) {
      continue;
    }
    const { component } = componentMap[componentId];
    Object.assign(style, component.style);
  }

  Object.assign(style, node.style);

  if (overrides[selfPath] && overrides[selfPath].style) {
    Object.assign(style, overrides[selfPath].style);
  }

  return style;
};

const evaluateLabel = (
  node: PCComponent | PCElement | PCComponentInstanceElement | PCTextNode,
  selfPath: string,
  overrides: EvalOverrides
) => {
  return (
    evaluateOverride(
      node,
      selfPath,
      PCOverridablePropertyName.LABEL,
      overrides
    ) || node.label
  );
};

const evaluateVisibleNode = (
  node: PCVisibleNode | PCSlot | PCPlug,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  variant: KeyValue<boolean>,
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
): SyntheticVisibleNode => {
  if (node.name === PCSourceTagNames.ELEMENT) {
    return evaluateElement(
      node,
      instancePath,
      immutable,
      isCreatedFromComponent,
      variant,
      overrides,
      componentMap,
      sourceUri
    );
  } else if (node.name === PCSourceTagNames.COMPONENT_INSTANCE) {
    return evaluateComponentInstance(
      node,
      node,
      null,
      instancePath,
      immutable,
      isCreatedFromComponent,
      variant,
      overrides,
      componentMap,
      sourceUri
    );
  } else if (node.name === PCSourceTagNames.TEXT) {
    return evaluateTextNode(
      node,
      instancePath,
      immutable,
      isCreatedFromComponent,
      componentMap,
      overrides
    );
  }
};

const evaluateSlot = (
  slot: PCSlot,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  variant: KeyValue<boolean>,
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
): SyntheticVisibleNode[] => {
  if (overrides[slot.id]) {
    return overrides[slot.id].children;
  }
  // TODO - check if slot is overridden

  return slot.children.map(child =>
    evaluateVisibleNode(
      child,
      instancePath,
      immutable,
      isCreatedFromComponent,
      variant,
      overrides,
      componentMap,
      sourceUri
    )
  );
};

const evaluateElement = (
  element: PCComponent | PCElement | PCComponentInstanceElement,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  variant: KeyValue<boolean>,
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
): SyntheticElement => {
  const selfPath = appendPath(instancePath, element.id);
  return createSyntheticElement(
    element.is,
    createSyntheticSource(element),
    evaluateStyle(element, selfPath, componentMap, overrides),
    evaluateAttributes(element, selfPath, overrides, sourceUri),
    evaluateChildren(
      element,
      instancePath,
      immutable,
      isCreatedFromComponent,
      variant,
      overrides,
      componentMap,
      sourceUri
    ),
    evaluateLabel(element, selfPath, overrides),
    false,
    isCreatedFromComponent,
    false,
    immutable,
    element.metadata
  );
};

const evaluateOverride = (
  element: PCComponent | PCElement | PCComponentInstanceElement | PCTextNode,
  selfPath: string,
  propertyName: PCOverridablePropertyName,
  overrides: EvalOverrides
) => {
  let override;
  if (!overrides[selfPath] || !(override = overrides[selfPath][propertyName])) {
    return element[propertyName];
  }
  if (typeof override !== "object") {
    return override;
  }
  return Object.assign({}, element[propertyName], override);
};

const evaluateVariants = (
  instancePath: string,
  variants: PCVariant[],
  overrides: EvalOverrides
) => {
  const usedVariant = {};

  for (const variant of variants) {
    const override = overrides[appendPath(instancePath, variant.id)];
    usedVariant[variant.id] =
      override && override[PCOverridablePropertyName.VARIANT_IS_DEFAULT] != null
        ? override[PCOverridablePropertyName.VARIANT_IS_DEFAULT]
        : variant.isDefault;
  }
  return usedVariant;
};

const evaluateAttributes = (
  element: PCComponent | PCElement | PCComponentInstanceElement,
  selfPath: string,
  overrides: EvalOverrides,
  sourceUri: string
) => {
  let attributes = evaluateOverride(
    element,
    selfPath,
    PCOverridablePropertyName.ATTRIBUTES,
    overrides
  );

  if (
    element.is === "img" &&
    attributes.src &&
    attributes.src.charAt(0) === "."
  ) {
    attributes = {
      ...attributes,
      src: addProtocol(
        FILE_PROTOCOL,
        path.resolve(stripProtocol(path.dirname(sourceUri)), attributes.src)
      )
    };
  } else if (
    element.is === "object" &&
    attributes.data &&
    attributes.data.charAt(0) === "."
  ) {
    attributes = {
      ...attributes,
      data: addProtocol(
        FILE_PROTOCOL,
        path.resolve(stripProtocol(path.dirname(sourceUri)), attributes.data)
      )
    };
  }
  return attributes;
};

const evaluateChildren = (
  parent:
    | PCComponent
    | PCElement
    | PCComponentInstanceElement
    | PCOverride
    | PCPlug,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  variant: KeyValue<boolean>,
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
): SyntheticVisibleNode[] => {
  const selfPath = appendPath(instancePath, parent.id);
  if (overrides[selfPath] && overrides[selfPath].children) {
    return overrides[selfPath].children;
  }
  const children: SyntheticVisibleNode[] = [];

  for (let i = 0, { length } = parent.children; i < length; i++) {
    const child = parent.children[i];
    if (child.name === PCSourceTagNames.SLOT) {
      children.push(
        ...evaluateSlot(
          child,
          instancePath,
          immutable,
          isCreatedFromComponent,
          variant,
          overrides,
          componentMap,
          sourceUri
        )
      );
    } else if (isVisibleNode(child)) {
      children.push(
        evaluateVisibleNode(
          child,
          instancePath,
          immutable,
          isCreatedFromComponent,
          variant,
          overrides,
          componentMap,
          sourceUri
        )
      );
    }
  }

  return children;
};

const evaluateTextNode = (
  node: PCTextNode,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  componentMap: ComponentRefs,
  overrides: EvalOverrides
): SyntheticTextNode => {
  const selfId = appendPath(instancePath, node.id);
  return createSyntheticTextNode(
    evaluateOverride(node, selfId, PCOverridablePropertyName.TEXT, overrides) ||
      node.value,
    createSyntheticSource(node),
    evaluateStyle(node, selfId, componentMap, overrides),
    evaluateLabel(node, selfId, overrides),
    false,
    isCreatedFromComponent,
    immutable,
    node.metadata
  );
};

const createSyntheticSource = memoize(
  (node: PCNode): SyntheticSource => ({
    nodeId: node.id
  })
);

const appendPath = (instancePath: string, id: string) =>
  instancePath && id ? instancePath + " " + id : id || instancePath;

const registerOverrides = (
  node: PCComponent | PCComponentInstanceElement,
  instancePath: string,
  selfPath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  variant: KeyValue<boolean>,
  selfVariant: KeyValue<boolean>,
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
) => {
  const overrideNodes = getOverrides(node);
  const nodeIsComponent = isComponent(node);
  const childOverridePath = nodeIsComponent ? selfPath : instancePath;
  const childOverrideVariant = nodeIsComponent ? selfVariant : variant;

  for (let i = 0, { length } = overrideNodes; i < length; i++) {
    const overrideNode = overrideNodes[i];
    if (
      overrideNode.variantId &&
      !childOverrideVariant[overrideNode.variantId]
    ) {
      continue;
    }

    const overrideInstancePath = appendPath(
      selfPath,
      overrideNode.targetIdPath.join(" ")
    );

    if (overrideNode.propertyName === PCOverridablePropertyName.CHILDREN) {
      if (overrideNode.children.length) {
        registerOverride(
          overrideNode.variantId,
          overrideNode.propertyName,
          evaluateChildren(
            overrideNode,
            childOverridePath,
            immutable,
            isCreatedFromComponent,
            variant,
            overrides,
            componentMap,
            sourceUri
          ),
          overrideInstancePath,
          overrides
        );
      }
    } else {
      registerOverride(
        overrideNode.variantId,
        overrideNode.propertyName,
        overrideNode.value,
        overrideInstancePath,
        overrides
      );
    }
  }

  if (Object.keys(node.style).length) {
    registerOverride(
      null,
      PCOverridablePropertyName.STYLE,
      node.style,
      selfPath,
      overrides
    );
  }

  if (node.inheritStyle) {
    registerOverride(
      null,
      PCOverridablePropertyName.INHERIT_STYLE,
      node.inheritStyle,
      selfPath,
      overrides
    );
  }

  if (Object.keys(node).length) {
    registerOverride(
      null,
      PCOverridablePropertyName.STYLE,
      node.style,
      selfPath,
      overrides
    );
  }
  if (Object.keys(node.attributes).length) {
    registerOverride(
      null,
      PCOverridablePropertyName.ATTRIBUTES,
      node.attributes,
      selfPath,
      overrides
    );
  }

  if (node.name === PCSourceTagNames.COMPONENT_INSTANCE) {
    for (let i = node.children.length; i--; ) {
      const child = node.children[i] as PCNode;
      if (child.name === PCSourceTagNames.PLUG && child.children.length) {
        overrides[child.slotId] = {
          attributes: null,
          text: null,
          style: null,
          isDefault: false,
          inheritStyle: null,
          label: null,
          children: evaluateChildren(
            child,
            selfPath,
            immutable,
            isCreatedFromComponent,
            selfVariant,
            overrides,
            componentMap,
            sourceUri
          )
        };
      }
    }
  }
  if (
    node.name === PCSourceTagNames.COMPONENT ||
    node.name === PCSourceTagNames.COMPONENT_INSTANCE
  ) {
    if (getVisibleOrSlotChildren(node).length) {
      const childPath =
        node.name === PCSourceTagNames.COMPONENT_INSTANCE
          ? instancePath
          : selfPath;

      registerOverride(
        null,
        PCOverridablePropertyName.CHILDREN,
        evaluateChildren(
          node,
          childPath,
          immutable,
          isCreatedFromComponent,
          selfVariant,
          overrides,
          componentMap,
          sourceUri
        ),
        selfPath,
        overrides
      );
    }
  }
};

const registerOverride = (
  variantId: string,
  propertyName: PCOverridablePropertyName,
  value: any,
  nodePath: string,
  overrides: EvalOverrides
) => {
  // TODO - variant check here

  if (!overrides[nodePath]) {
    overrides[nodePath] = {
      style: null,
      inheritStyle: null,
      attributes: null,
      children: null,
      isDefault: null,
      text: null,
      label: null
    };
  }

  const override: EvalOverride = overrides[nodePath];

  let newValue = value;

  if (propertyName === PCOverridablePropertyName.CHILDREN) {
    newValue = override.children ? override.children : value;
  } else if (
    propertyName === PCOverridablePropertyName.ATTRIBUTES ||
    propertyName === PCOverridablePropertyName.STYLE
  ) {
    newValue = Object.assign({}, value, override[propertyName] || {});
  } else if (
    propertyName === PCOverridablePropertyName.TEXT &&
    override.text != null
  ) {
    newValue = override[propertyName];
  } else if (
    propertyName === PCOverridablePropertyName.LABEL &&
    override.label != null
  ) {
    newValue = override[propertyName];
  } else if (
    propertyName === PCOverridablePropertyName.VARIANT_IS_DEFAULT &&
    override.isDefault != null
  ) {
    newValue = override[propertyName];
  }
  override[propertyName] = newValue;
};
