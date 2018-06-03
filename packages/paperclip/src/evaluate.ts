import {
  SyntheticElement,
  SyntheticTextNode,
  createSytheticDocument,
  createSyntheticElement,
  createSyntheticTextNode,
  SyntheticVisibleNode,
  SyntheticSource,
  getSyntheticSourceNode,
  SyntheticDocument
} from "./synthetic";
import {
  PCModule,
  PCComponent,
  PCVisibleNode,
  PCSourceTagNames,
  getComponentTemplate,
  PCTextNode,
  PCElement,
  extendsComponent,
  getPCNode,
  PCNode,
  PCOverride,
  getVisibleChildren,
  getOverrides,
  PCStyleOverride,
  PCAttributesOverride,
  PCChildrenOverride,
  PCComponentInstanceElement,
  getDefaultVariantIds,
  createPCDependency,
  PCOverridablePropertyName,
  getComponentRefIds,
  getComponentGraphRefs
} from "./dsl";
import { DependencyGraph, Dependency } from "./graph";
import {
  generateUID,
  KeyValue,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  memoize
} from "tandem-common";
import { values } from "lodash";

type EvalOverride = {
  [PCOverridablePropertyName.ATTRIBUTES]: KeyValue<any>;
  [PCOverridablePropertyName.STYLE]: KeyValue<any>;
  [PCOverridablePropertyName.CHILDREN]: SyntheticVisibleNode[];
  [PCOverridablePropertyName.VARIANT]: string[];
  [PCOverridablePropertyName.TEXT]: string;
};

type EvalContext = {
  isContentNode?: boolean;
  nodesAreImmutable?: boolean;
  isCreatedFromComponent?: boolean;
  currentVariantIds: string[];
  overrides: {
    [identifier: string]: EvalOverride;
  };
  componentRefs: {
    [identifier: string]: PCComponent;
  };
};

const createContext = memoize((...refs: PCComponent[]) => {
  const componentRefs = {};
  for (let i = 0, { length } = refs; i < length; i++) {
    componentRefs[refs[i].id] = refs[i];
  }
  return {
    overrides: {},
    currentVariantIds: [],
    componentRefs
  };
});

export const evaluatePCModule = memoize(
  (
    module: PCModule,
    graph: DependencyGraph = wrapModuleInDependencyGraph(module)
  ): SyntheticDocument =>
    createSytheticDocument(
      createSyntheticSource(module),
      module.children.map(child => {
        return evaluateContentNode(
          child,
          createContext(...getComponentGraphRefs(child, graph))
        );
      })
    )
);

const wrapModuleInDependencyGraph = (module: PCModule): DependencyGraph => ({
  [module.id]: createPCDependency(module.id, module)
});

const evaluateContentNode = memoize(
  (root: PCComponent | PCVisibleNode, context: EvalContext) => {
    context = { ...context, isContentNode: true };
    switch (root.name) {
      case PCSourceTagNames.COMPONENT: {
        return evaluateRootComponent(root, context);
      }
      default: {
        return evaluatePCVisibleNode(root, null, context);
      }
    }
  }
);

const evaluateRootComponent = (
  root: PCComponent,
  context: EvalContext,
  isContentNode?: boolean
) => {
  return evaluateComponentOrElement(root, root, null, context);
};

const evaluatePCVisibleNode = (
  node: PCVisibleNode | PCComponent,
  instancePath: string,
  context: EvalContext
): SyntheticVisibleNode => {
  switch (node.name) {
    case PCSourceTagNames.TEXT: {
      return applyPropertyOverrides(
        createSyntheticTextNode(
          (node as PCTextNode).value,
          createSyntheticSource(node),
          node.style,
          node.label,
          context.isContentNode,
          context.isCreatedFromComponent,
          Boolean(context.nodesAreImmutable),
          node.metadata
        ),
        appendPath(instancePath, node.id),
        context
      );
    }
    default: {
      const pcElement = node as PCElement;

      return evaluateComponentOrElement(
        pcElement,
        pcElement,
        instancePath,
        context
      );
    }
  }
};

// const evaluateComponentOrElementFromInstance = (
//   elementOrComponent: PCElement | PCComponent,
//   instanceNode: PCComponent | PCElement | PCComponentInstanceElement,
//   instancePath: string,
//   context: EvalContext
// ): SyntheticElement => {
//   if (instanceNode.name === PCSourceTagNames.COMPONENT_INSTANCE) {
//     // TODO - sort variants
//     context = {
//       ...context,
//       currentVariantIds: instanceNode.variant,
//       isCreatedFromComponent: true
//     };
//   } else if (instanceNode.name === PCSourceTagNames.COMPONENT) {
//     context = {
//       ...context,
//       isCreatedFromComponent: true,
//       currentVariantIds: getDefaultVariantIds(instanceNode)
//     };
//   }

//   return evaluateComponentOrElement(
//     elementOrComponent,
//     instanceNode,
//     instancePath,
//     context
//   );
// };

const maybeImmutable = (
  node: PCNode,
  instanceNode: PCNode,
  context: EvalContext
) => {
  // parent component children are immutable
  if (
    node.name === PCSourceTagNames.COMPONENT &&
    (instanceNode.name === PCSourceTagNames.COMPONENT ||
      instanceNode.name === PCSourceTagNames.COMPONENT_INSTANCE) &&
    node !== instanceNode
  ) {
    return { ...context, nodesAreImmutable: true };
  }

  return context;
};

const removeisContentNode = (context: EvalContext) =>
  context.isContentNode ? { ...context, isContentNode: false } : context;

const evaluateComponentOrElement = (
  elementOrComponent: PCElement | PCComponent,
  instanceNode: PCComponent | PCElement | PCComponentInstanceElement,
  instancePath: string,
  context: EvalContext
): SyntheticElement => {
  const selfIdPath = appendPath(instancePath, instanceNode.id);
  const isComponentInstance =
    instanceNode.name === PCSourceTagNames.COMPONENT_INSTANCE;

  if (elementOrComponent.name === PCSourceTagNames.COMPONENT) {
    context = { ...context, isCreatedFromComponent: true };
  }

  context = registerOverrides(
    elementOrComponent,
    instanceNode,
    isComponentInstance ? selfIdPath : instancePath,
    context
  );
  if (extendsComponent(elementOrComponent)) {
    return evaluateComponentOrElement(
      context.componentRefs[elementOrComponent.is],
      instanceNode,
      instancePath,
      context
    );
  } else {
    const isContentNode = context.isContentNode;
    context = removeisContentNode(context);

    const childInstancePath = isComponentInstance ? selfIdPath : instancePath;

    return applyPropertyOverrides(
      createSyntheticElement(
        elementOrComponent.is,
        createSyntheticSource(instanceNode),
        instanceNode.style,
        instanceNode.attributes,
        getChildOverrides(
          selfIdPath,
          context,
          getVisibleChildren(elementOrComponent).map(child =>
            evaluatePCVisibleNode(child, childInstancePath, context)
          )
        ),
        instanceNode.label || elementOrComponent.label,
        Boolean(isContentNode),
        Boolean(context.isCreatedFromComponent),
        Boolean(isComponentInstance),
        Boolean(context.nodesAreImmutable),
        instanceNode.metadata
      ),
      selfIdPath,
      context
    );
  }
};

const applyPropertyOverrides = <TNode extends SyntheticVisibleNode>(
  node: TNode,
  nodePath: string,
  context: EvalContext
): TNode => {
  const overrides = context.overrides[nodePath];
  if (!overrides) {
    return node;
  }
  if (node.name === PCSourceTagNames.TEXT) {
    return {
      ...(node as any),
      value: overrides.text || (node as SyntheticTextNode).value,
      style: {
        ...node.style,
        ...overrides.style
      }
    };
  }
  return {
    ...(node as any),
    attributes: {
      ...(node as SyntheticElement).attributes,
      ...overrides.attributes
    },
    style: {
      ...node.style,
      ...overrides.style
    }
  };
};

const getChildOverrides = (
  nodePath: string,
  context: EvalContext,
  defaultChildren: SyntheticVisibleNode[]
) => {
  const children =
    context.overrides[nodePath] && context.overrides[nodePath].children;

  return children && children.length ? children : defaultChildren;
};

const registerOverride = (
  variantId: string,
  propertyName: PCOverridablePropertyName,
  value: any,
  nodePath: string,
  context: EvalContext
): EvalContext => {
  if (variantId && context.currentVariantIds.indexOf(variantId) === -1) {
    return context;
  }

  const override: EvalOverride = context.overrides[nodePath] || {
    style: EMPTY_OBJECT,
    attributes: EMPTY_OBJECT,
    children: EMPTY_ARRAY,
    variant: EMPTY_ARRAY,
    text: null
  };

  let newValue = value;

  if (propertyName === PCOverridablePropertyName.CHILDREN) {
    newValue = override.children.length || !value ? override.children : value;
  } else if (
    propertyName === PCOverridablePropertyName.ATTRIBUTES ||
    propertyName === PCOverridablePropertyName.STYLE
  ) {
    newValue = {
      ...value,
      ...override[propertyName]
    };
  } else if (
    propertyName === PCOverridablePropertyName.TEXT &&
    override.text != null
  ) {
    newValue = override[propertyName];
  }

  return {
    ...context,
    overrides: {
      ...context.overrides,
      [nodePath]: {
        ...override,
        [propertyName]: newValue
      }
    }
  };
};

const registerOverrides = (
  node: PCElement | PCComponent,
  instanceNode: PCComponent | PCElement | PCComponentInstanceElement,
  instancePath: string,
  context: EvalContext
) => {
  const existingOverrides = {};
  let hasOverride = false;

  const nodePath =
    instanceNode.name === PCSourceTagNames.COMPONENT_INSTANCE
      ? instancePath
      : appendPath(instancePath, instanceNode.id);

  context = getOverrides(node).reduce((context, override: PCOverride) => {
    const idPathStr = override.targetIdPath.length
      ? appendPath(instancePath, override.targetIdPath.join(" "))
      : nodePath;
    if (override.propertyName === PCOverridablePropertyName.CHILDREN) {
      return registerOverride(
        override.variantId,
        override.propertyName,
        override.children.map(child =>
          evaluatePCVisibleNode(
            child as PCVisibleNode,
            instancePath,
            maybeImmutable(node, instanceNode, removeisContentNode(context))
          )
        ),
        idPathStr,
        context
      );
    } else {
      return registerOverride(
        override.variantId,
        override.propertyName,
        override.value,
        idPathStr,
        context
      );
    }
  }, context);

  context = registerOverride(
    null,
    PCOverridablePropertyName.STYLE,
    node.style,
    nodePath,
    context
  );

  context = registerOverride(
    null,
    PCOverridablePropertyName.ATTRIBUTES,
    node.attributes,
    nodePath,
    context
  );

  context = registerOverride(
    null,
    PCOverridablePropertyName.CHILDREN,
    getVisibleChildren(node).map(child =>
      evaluatePCVisibleNode(
        child as PCVisibleNode,
        instancePath,
        maybeImmutable(node, instanceNode, removeisContentNode(context))
      )
    ),
    nodePath,
    context
  );

  return context;
};

const createSyntheticSource = (node: PCNode): SyntheticSource => ({
  nodeId: node.id
});

const appendPath = (instancePath: string, nodeId: string) =>
  instancePath ? instancePath + " " + nodeId : nodeId;
