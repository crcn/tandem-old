import { DependencyGraph, Dependency } from "./graph";
import {
  SyntheticDocument,
  SyntheticElement,
  SyntheticVisibleNode,
  createSyntheticElement,
  createSytheticDocument,
  SyntheticSource,
  SyntheticTextNode,
  createSyntheticTextNode
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
  PCOverride
} from "./dsl";
import { KeyValue, memoize } from "tandem-common";

type EvalOverride = {
  [PCOverridablePropertyName.ATTRIBUTES]: KeyValue<any>;
  [PCOverridablePropertyName.STYLE]: KeyValue<any>;
  [PCOverridablePropertyName.CHILDREN]: SyntheticVisibleNode[];
  [PCOverridablePropertyName.VARIANT]: string[];
  [PCOverridablePropertyName.TEXT]: string;
};

type EvalOverrides = {
  // instance path
  [identifier: string]: EvalOverride;
};

type ComponentRefs = {
  [identifier: string]: PCComponent;
};

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
        getComponentGraphRefMap(child, graph)
      );
    }

    return createSytheticDocument(
      createSyntheticSource(module),
      documentChildren
    );
  }
);

const wrapModuleInDependencyGraph = (module: PCModule): DependencyGraph => ({
  [module.id]: createPCDependency(module.id, module)
});

const evaluateContentNode = memoize(
  (
    node: PCVisibleNode | PCComponent,
    componentMap: ComponentRefs
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
        componentMap
      );
    } else {
      syntheticNode = evaluateVisibleNode(
        node,
        null,
        false,
        false,
        overrides,
        componentMap
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
  componentMap: ComponentRefs
): SyntheticElement => {
  const selfPath = appendPath(instancePath, instance.id);
  const isComponentInstance =
    instance.name === PCSourceTagNames.COMPONENT_INSTANCE;
  const childComponentInstancePath = isComponentInstance
    ? selfPath
    : instancePath;
  const childrenAreImmutable = immutable || node !== instance;
  registerOverrides(
    node,
    instance,
    instancePath,
    selfPath,
    childrenAreImmutable,
    true,
    overrides,
    componentMap
  );

  if (extendsComponent(node)) {
    return evaluateComponentInstance(
      componentMap[node.is],
      instance,
      label || node.label,
      instancePath,
      immutable,
      true,
      overrides,
      componentMap
    );
  }

  const children = overrides[selfPath].children;

  return createSyntheticElement(
    node.is,
    createSyntheticSource(instance),
    evaluateOverride(
      node,
      selfPath,
      PCOverridablePropertyName.STYLE,
      overrides
    ),
    evaluateOverride(
      node,
      selfPath,
      PCOverridablePropertyName.ATTRIBUTES,
      overrides
    ),
    children,
    label || node.label,
    false,
    isCreatedFromComponent,
    isComponentInstance,
    immutable,
    instance.metadata
  );
};

const evaluateVisibleNode = (
  node: PCVisibleNode,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  overrides: EvalOverrides,
  componentMap: ComponentRefs
): SyntheticVisibleNode => {
  if (node.name === PCSourceTagNames.ELEMENT) {
    return evaluateElement(
      node,
      instancePath,
      immutable,
      isCreatedFromComponent,
      overrides,
      componentMap
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
      componentMap
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
  overrides: EvalOverrides,
  componentMap: ComponentRefs
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
    evaluateOverride(
      element,
      selfPath,
      PCOverridablePropertyName.ATTRIBUTES,
      overrides
    ),
    evaluateChildren(
      element,
      instancePath,
      immutable,
      isCreatedFromComponent,
      overrides,
      componentMap
    ),
    element.label,
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

const evaluateChildren = (
  parent: PCComponent | PCElement | PCComponentInstanceElement | PCOverride,
  instancePath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  overrides: EvalOverrides,
  componentMap: ComponentRefs
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
      overrides,
      componentMap
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
    node.label,
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
  instancePath && id ? instancePath + " " + id : id;

const registerOverrides = (
  node: PCElement | PCComponent | PCComponentInstanceElement,
  instance: PCComponent | PCComponentInstanceElement,
  instancePath: string,
  selfPath: string,
  immutable: boolean,
  isCreatedFromComponent: boolean,
  overrides: EvalOverrides,
  componentMap: ComponentRefs
) => {
  const overrideNodes = getOverrides(node);

  const isComponentInstance =
    instance.name === PCSourceTagNames.COMPONENT_INSTANCE;

  for (let i = 0, { length } = overrideNodes; i < length; i++) {
    const overrideNode = overrideNodes[i];
    const overrideInstancePath = appendPath(
      isComponentInstance ? selfPath : instancePath,
      overrideNode.targetIdPath.join(" ")
    );
    if (overrideNode.propertyName === PCOverridablePropertyName.CHILDREN) {
      if (overrideNode.children.length) {
        registerOverride(
          overrideNode.variantId,
          overrideNode.propertyName,
          evaluateChildren(
            overrideNode,
            instancePath,
            immutable,
            isCreatedFromComponent,
            overrides,
            componentMap
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
    (node.name === PCSourceTagNames.COMPONENT_INSTANCE ||
      node.name === PCSourceTagNames.COMPONENT) &&
    getVisibleChildren(node).length
  ) {
    registerOverride(
      null,
      PCOverridablePropertyName.CHILDREN,
      evaluateChildren(
        node,
        isComponentInstance ? selfPath : instancePath,
        immutable,
        isCreatedFromComponent,
        overrides,
        componentMap
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
      variant: null,
      text: null
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
  }
  override[propertyName] = newValue;
};
