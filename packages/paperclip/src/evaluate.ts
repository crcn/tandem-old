import {
  SyntheticElement,
  SyntheticTextNode,
  SyntheticFrame,
  createSyntheticElement,
  createSyntheticTextNode,
  SyntheticNode,
  SyntheticSource,
  SyntheticFrames,
  getSyntheticSourceNode
} from "./synthetic";
import {
  PCModule,
  PCFrame,
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
  createPCDependency
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
  style: KeyValue<any>;
  children: SyntheticNode[];
  attributes: KeyValue<any>;
  addVariants: string[];
  removeVariants: string[];
  textValue?: string;
};

type EvalContext = {
  isRoot?: boolean;
  isCreatedFromComponent?: boolean;
  currentVariantIds: string[];
  overrides: {
    [identifier: string]: EvalOverride;
  };
  graph: DependencyGraph;
};

export const evaluatePCModule = memoize(
  (
    module: PCModule,
    graph: DependencyGraph = wrapModuleInDependencyGraph(module)
  ): SyntheticFrames =>
    module.children.reduce(
      (frames, frame) => ({
        ...frames,
        [frame.id]: evaluatePCFrame(frame, {
          overrides: {},
          graph,
          currentVariantIds: []
        })
      }),
      {}
    )
);

const wrapModuleInDependencyGraph = (module: PCModule): DependencyGraph => ({
  [module.id]: createPCDependency(module.id, module)
});

const evaluatePCFrame = (
  frame: PCFrame,
  context: EvalContext
): SyntheticFrame => ({
  source: createSyntheticSource(frame),
  bounds: frame.bounds,
  root: evaluatePCFrameRootNode(frame.children[0], context)
});

const evaluatePCFrameRootNode = (
  root: PCComponent | PCVisibleNode,
  context: EvalContext
) => {
  context = { ...context, isRoot: true };
  switch (root.name) {
    case PCSourceTagNames.COMPONENT: {
      return evaluateRootComponent(root, context);
    }
    default: {
      return evaluatePCVisibleNode(root, null, context);
    }
  }
};

const evaluateRootComponent = (
  root: PCComponent,
  context: EvalContext,
  isRoot?: boolean
) => {
  return evaluateComponentOrElementFromInstance(root, root, null, context);
};

const evaluatePCVisibleNode = (
  node: PCVisibleNode | PCComponent,
  instancePath: string,
  context: EvalContext
): SyntheticNode => {
  switch (node.name) {
    case PCSourceTagNames.TEXT: {
      return applyPropertyOverrides(
        createSyntheticTextNode(
          (node as PCTextNode).value,
          createSyntheticSource(node),
          node.style,
          node.label,
          context.isRoot,
          context.isCreatedFromComponent
        ),
        appendPath(instancePath, node.id),
        context
      );
    }
    default: {
      const pcElement = node as PCElement;

      return evaluateComponentOrElementFromInstance(
        pcElement,
        pcElement,
        instancePath,
        context
      );
    }
  }
};

const evaluateComponentOrElementFromInstance = (
  elementOrComponent: PCElement | PCComponent,
  instanceNode: PCComponent | PCElement | PCComponentInstanceElement,
  instancePath: string,
  context: EvalContext
): SyntheticElement => {
  if (instanceNode.name === PCSourceTagNames.COMPONENT_INSTANCE) {
    // TODO - sort variants
    context = {
      ...context,
      currentVariantIds: instanceNode.variant,
      isCreatedFromComponent: true
    };
  } else if (instanceNode.name === PCSourceTagNames.COMPONENT) {
    context = {
      ...context,
      isCreatedFromComponent: true,
      currentVariantIds: getDefaultVariantIds(instanceNode)
    };
  }

  return evaluateComponentOrElement(
    elementOrComponent,
    instanceNode,
    instancePath,
    context
  );
};

const removeIsRoot = (context: EvalContext) =>
  context.isRoot ? { ...context, isRoot: false } : context;

const evaluateComponentOrElement = (
  elementOrComponent: PCElement | PCComponent,
  instanceNode: PCComponent | PCElement | PCComponentInstanceElement,
  instancePath: string,
  context: EvalContext
): SyntheticElement => {
  const selfIdPath = appendPath(instancePath, instanceNode.id);

  context = registerOverrides(elementOrComponent, selfIdPath, context);
  if (extendsComponent(elementOrComponent)) {
    return evaluateComponentOrElement(
      getPCNode(elementOrComponent.is, context.graph) as PCComponent,
      instanceNode,
      instancePath,
      context
    );
  } else {
    const isRoot = context.isRoot;
    context = removeIsRoot(context);
    const isComponentInstance =
      instanceNode.name === PCSourceTagNames.COMPONENT_INSTANCE;

    const childInstancePath = isComponentInstance ? selfIdPath : instancePath;

    return applyPropertyOverrides(
      createSyntheticElement(
        elementOrComponent.is,
        createSyntheticSource(instanceNode),
        instanceNode.style,
        instanceNode.attributes,
        getChildOverrides(
          instancePath,
          context,
          getVisibleChildren(elementOrComponent).map(child =>
            evaluatePCVisibleNode(child, childInstancePath, context)
          )
        ),
        instanceNode.label || elementOrComponent.label,
        Boolean(isRoot),
        Boolean(context.isCreatedFromComponent),
        Boolean(isComponentInstance)
      ),
      selfIdPath,
      context
    );
  }
};

const applyPropertyOverrides = <TNode extends SyntheticNode>(
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
  defaultChildren: SyntheticNode[]
) => {
  const children =
    context.overrides[nodePath] && context.overrides[nodePath].children;
  return children && children.length ? children : defaultChildren;
};

const registerOverride = (
  variantId: string,
  style: any,
  attributes: any,
  children: SyntheticNode[],
  nodePath: string,
  context: EvalContext
): EvalContext => {
  if (variantId && context.currentVariantIds.indexOf(variantId) === -1) {
    return context;
  }

  const override = context.overrides[nodePath] || {
    style: EMPTY_OBJECT,
    attributes: EMPTY_OBJECT,
    children: EMPTY_ARRAY,
    addVariants: EMPTY_ARRAY,
    removeVariants: EMPTY_ARRAY,
    textValue: null
  };

  return {
    ...context,
    overrides: {
      ...context.overrides,
      [nodePath]: {
        addVariants: EMPTY_ARRAY,
        removeVariants: EMPTY_ARRAY,
        style: style
          ? {
              ...style,
              ...override.style
            }
          : override.style,
        attributes: attributes
          ? {
              ...attributes,
              ...override.attributes
            }
          : override.attributes,
        children:
          override.children.length || !children ? override.children : children
      }
    }
  };
};

const registerOverrides = (
  node: PCElement | PCComponent,
  nodePath: string,
  context: EvalContext
) => {
  const existingOverrides = {};
  let hasOverride = false;

  context = getOverrides(node).reduce((context, source) => {
    const idPathStr = source.targetIdPath.length
      ? appendPath(nodePath, source.targetIdPath.join(" "))
      : nodePath;
    switch (source.name) {
      case PCSourceTagNames.OVERRIDE_STYLE: {
        return registerOverride(
          source.variantId,
          source.value,
          null,
          null,
          idPathStr,
          context
        );
      }
      case PCSourceTagNames.OVERRIDE_ATTRIBUTES: {
        return registerOverride(
          source.variantId,
          null,
          source.value,
          null,
          idPathStr,
          context
        );
      }
      case PCSourceTagNames.OVERRIDE_CHILDREN: {
        return registerOverride(
          source.variantId,
          null,
          null,
          source.children.map(child => {
            return evaluatePCVisibleNode(
              child,
              nodePath,
              removeIsRoot(context)
            );
          }),
          idPathStr,
          context
        );
      }
    }

    return context;
  }, context);

  context = registerOverride(
    null,
    node.style,
    node.attributes,
    null,
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
