import * as path from "path";
import { DependencyGraph, Dependency } from "./graph";
import {
  SyntheticDocument,
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
  PCDependency,
  createPCDependency,
  PCOverridablePropertyName,
  PCVisibleNode,
  PCComponent,
  getComponentGraphRefs,
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
  isPCComponentInstance,
  PCVariant
} from "./dsl";
import {
  KeyValue,
  memoize,
  stripProtocol,
  addProtocol,
  FILE_PROTOCOL,
  EMPTY_ARRAY,
  EMPTY_OBJECT
} from "tandem-common";
import { uniq } from "lodash";

type EvalOverride = {
  [PCOverridablePropertyName.ATTRIBUTES]: KeyValue<any>;
  [PCOverridablePropertyName.STYLE]: KeyValue<any>;
  [PCOverridablePropertyName.CHILDREN]: SyntheticVisibleNode[];
  [PCOverridablePropertyName.VARIANT_IS_DEFAULT]: boolean;
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
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
): SyntheticElement => {
  const selfPath = appendPath(instancePath, instance.id);
  const isComponentInstance =
    instance.name === PCSourceTagNames.COMPONENT_INSTANCE;

  // if (overrides[selfPath] && overrides[selfPath][PCOverridablePropertyName.VARIANT]) {
  //   variantIds = uniq([...overrides[selfPath][PCOverridablePropertyName.VARIANT], ...variantIds]);
  // } else {
  //   variantIds = uniq([...selfVariantIds, ...variantIds]);
  // }

  const variant = evaluateVariants(selfPath, getPCVariants(node), overrides);

  const childrenAreImmutable = immutable || node !== instance;
  registerOverrides(
    node,
    instancePath,
    selfPath,
    childrenAreImmutable,
    true,
    variant,
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
      overrides,
      componentMap,
      ref.sourceUri
    );
  }

  const children = overrides[selfPath] && overrides[selfPath].children;

  return createSyntheticInstanceElement(
    node.is,
    createSyntheticSource(instance),
    evaluateOverride(
      node,
      selfPath,
      PCOverridablePropertyName.STYLE,
      overrides
    ),
    variant,
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
  node: PCVisibleNode,
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
      overrides
    );
  }
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
    evaluateOverride(
      element,
      selfPath,
      PCOverridablePropertyName.STYLE,
      overrides
    ),
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

const evaluateVariants = (instancePath: string, variants: PCVariant[], overrides: EvalOverrides) => {
  const usedVariant = {};

  for (const variant of variants) {
    const override = overrides[appendPath(instancePath, variant.id)];
    usedVariant[variant.id] = override && override[PCOverridablePropertyName.VARIANT_IS_DEFAULT] != null ? override[PCOverridablePropertyName.VARIANT_IS_DEFAULT] : variant.isDefault;

    // if (variant.id === "15d6c81f3") {
    //   console.log("EVAL VAR", appendPath(instancePath, variant.id), override && override[PCOverridablePropertyName.VARIANT_IS_DEFAULT]);
    // }
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
  parent: PCComponent | PCElement | PCComponentInstanceElement | PCOverride,
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
  const visiblePCChildren = getVisibleChildren(parent);
  const children: SyntheticVisibleNode[] = new Array(visiblePCChildren.length);
  for (let i = 0, { length } = visiblePCChildren; i < length; i++) {
    children[i] = evaluateVisibleNode(
      visiblePCChildren[i],
      instancePath,
      immutable,
      isCreatedFromComponent,
      variant,
      overrides,
      componentMap,
      sourceUri
    );
  }

  return children;
};

const evaluateTextNode = (
  node: PCTextNode,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  overrides: EvalOverrides
): SyntheticTextNode => {
  const selfId = appendPath(instancePath, node.id);
  return createSyntheticTextNode(
    evaluateOverride(node, selfId, PCOverridablePropertyName.TEXT, overrides) ||
      node.value,
    createSyntheticSource(node),
    evaluateOverride(node, selfId, PCOverridablePropertyName.STYLE, overrides),
    evaluateLabel(node, selfId, overrides),
    false,
    isCreatedFromComponent,
    immutable,
    node.metadata
  );
};

const createSyntheticSource = memoize((node: PCNode): SyntheticSource => ({
  nodeId: node.id
}));

const appendPath = (instancePath: string, id: string) =>
  instancePath && id ? instancePath + " " + id : (id || instancePath);

const registerOverrides = (
  node: PCComponent | PCComponentInstanceElement,
  instancePath: string,
  selfPath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  variant: KeyValue<boolean>,
  overrides: EvalOverrides,
  componentMap: ComponentRefs,
  sourceUri: string
) => {
  const overrideNodes = getOverrides(node);

  for (let i = 0, { length } = overrideNodes; i < length; i++) {
    const overrideNode = overrideNodes[i];
    if (overrideNode.variantId && !variant[overrideNode.variantId]) {
      continue;
    }

    const childPath =
      node.name === PCSourceTagNames.COMPONENT ? selfPath : instancePath;

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
            childPath,
            immutable,
            isCreatedFromComponent,
            EMPTY_OBJECT,
            overrides,
            componentMap,
            sourceUri
          ),
          overrideInstancePath,
          overrides
        );
      }
    } else {
      // if (overrideInstancePath.indexOf("15d6c81f3") !== -1) {
      //   console.log(overrideInstancePath, selfPath);
      // }
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
  if (
    (node.name === PCSourceTagNames.COMPONENT ||
      node.name === PCSourceTagNames.COMPONENT_INSTANCE) &&
    getVisibleChildren(node).length
  ) {
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
        EMPTY_OBJECT,
        overrides,
        componentMap,
        sourceUri
      ),
      selfPath,
      overrides
    );
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
  } else if (propertyName === PCOverridablePropertyName.VARIANT_IS_DEFAULT && override.isDefault != null) {
    newValue = override[propertyName];
  }
  override[propertyName] = newValue;
};
