/**

TODO (in order of importance):

- render all components defined in a file
- attach source information to each node
- render all components loaded externally from other dependency
- component overrides

*/

import {
  TreeNode,
  DEFAULT_NAMESPACE,
  TreeNodeAttributes,
  getAttribute,
  generateTreeChecksum,
  removeNestedTreeNodeFromPath,
  removeNestedTreeNode,
  getParentTreeNode,
  updateNestedNode,
  setNodeAttribute,
  EMPTY_OBJECT,
  EMPTY_ARRAY,
  arraySplice,
  memoize
} from "tandem-common";
import {
  Dependency,
  DependencyGraph,
  getNodeSourceComponent,
  getNodeSourceModule,
  getModuleComponent,
  getNodeSourceDependency,
  getImportedDependency,
  getNodeReference,
  PCModuleNode,
  PCOverrideNode,
  PCComponentNode,
  getComponentTemplate,
  PCVisibleNodeAttributes,
  getComponentVariants,
  PCSourceTagNames,
  PCSetAttributeOverrideNode,
  PCSetStyleOverrideNode,
  PCTemplateNode,
  PCBaseVisibleNode,
  PCRectangleNodeAttributeNames,
  PCTextNode
} from "./dsl";
import {
  SyntheticNodeSource,
  SyntheticBrowser,
  SyntheticNode,
  SyntheticObject,
  SyntheticObjectType,
  SyntheticWindow,
  createSyntheticRectangle,
  getSytheticNodeSource,
  SyntheticDocument,
  getSyntheticDocumentDependency,
  EDITOR_NAMESPACE,
  EditorAttributeNames,
  getComponentInstanceSourceNode,
  createSyntheticTextNode
} from "./synthetic";

import { pick, merge } from "lodash";

export type EvaluateOptions = {
  entry: Dependency;
  graph: DependencyGraph;
};

export type EvaluationResult = {
  documentNodes: SyntheticNode[];
};

type Slots = {
  [identifier: string]: TreeNode<any, any>[];
};

type IDGenerator = () => string;

export const evaluateDependencyEntry = ({
  entry,
  graph
}: EvaluateOptions): EvaluationResult => {
  const checksum = generateTreeChecksum(entry.content);
  let i = 0;
  const generateId = () => checksum + i++;
  return {
    documentNodes: entry.content.children.map((element, i) =>
      evaluatRooteDocumentElement(element, entry, graph, generateId)
    )
  };
};

export const evaluatRooteDocumentElement = (
  element: TreeNode<any, any>,
  entry: Dependency,
  graph: DependencyGraph,
  generateId: IDGenerator
) => {
  if (element.name === PCSourceTagNames.COMPONENT) {
    return evaluateRootDocumentComponent(
      element as PCComponentNode,
      entry,
      graph,
      generateId
    );
  } else {
    const synthetic = evaluateNode(
      element,
      entry.content,
      generateId,
      entry,
      graph,
      null
    );
    return setNodeAttribute(synthetic, "style", {
      ...(getAttribute(synthetic, "style") || EMPTY_OBJECT)
    }) as SyntheticNode;
  }
};

export const evaluateRootDocumentComponent = (
  componentNode: PCComponentNode,
  currentDependency: Dependency,
  graph: DependencyGraph,
  generateId: IDGenerator
): SyntheticNode => {
  const dependency = getNodeSourceDependency(
    componentNode,
    currentDependency,
    graph
  );
  let element = _evaluateComponent(
    componentNode,
    {
      [DEFAULT_NAMESPACE]: {
        style: getAttribute(componentNode, "style")
      }
    },
    [],
    getSytheticNodeSource(componentNode, dependency),
    generateId,
    currentDependency.content,
    dependency,
    graph,
    EMPTY_ARRAY,
    true
  );
  element = setNodeAttribute(
    element,
    EditorAttributeNames.IS_COMPONENT_INSTANCE,
    false,
    EDITOR_NAMESPACE
  );
  element = setNodeAttribute(
    element,
    EditorAttributeNames.IS_COMPONENT_ROOT,
    true,
    EDITOR_NAMESPACE
  );
  return element;
};

const _evaluateComponent = (
  componentNode: PCComponentNode,
  attributes: PCVisibleNodeAttributes,
  children: TreeNode<any, any>[],
  source: SyntheticNodeSource,
  generateId: IDGenerator,
  module: PCModuleNode,
  dependency,
  graph: DependencyGraph,
  overrides: PCOverrideNode[] = EMPTY_ARRAY,
  isRoot?: boolean,
  createdFromComponent?: boolean
) => {
  let template = getComponentTemplate(componentNode);

  const slots = {};

  for (const child of children) {
    const slotName = child.attributes[DEFAULT_NAMESPACE].slot;
    if (!slots[slotName]) {
      slots[slotName] = [];
    }
    slots[slotName].push(child);
  }
  const componentContainerName = componentNode.attributes.undefined.container;

  const variants = attributes.undefined.variants;

  let syntheticChildren = slots[componentContainerName];

  if (!syntheticChildren) {
    template = getComponentVariants(componentNode).reduce(
      (template, variant) => {
        return (variants
        ? variants.indexOf(variant.attributes.undefined.name) !== -1
        : isRoot && variant.attributes.undefined.isDefault)
          ? overrideComponentTemplate(template, variant.children)
          : template;
      },
      template
    );

    syntheticChildren = template
      ? template.children.map((child, i) =>
          evaluateNode(
            child,
            module,
            generateId,
            dependency,
            graph,
            slots,
            createdFromComponent
          )
        )
      : EMPTY_ARRAY;
  }

  const syntheticAttributes = merge(
    {},
    {
      [DEFAULT_NAMESPACE]: {
        label: getAttribute(componentNode, "label"),
        style: getAttribute(componentNode, "style")
      },
      [EDITOR_NAMESPACE]: {
        [EditorAttributeNames.CREATED_FROM_COMPONENT]: createdFromComponent,
        [EditorAttributeNames.IS_COMPONENT_INSTANCE]: createdFromComponent
      }
    },
    attributes
  );

  // TODO - pass slots down
  // TODO - check for existing component extends:importName="component"
  let element = createSyntheticRectangle(
    syntheticAttributes,
    syntheticChildren,
    source,
    generateId()
  );
  return element;
};

const overrideComponentTemplate = (
  template: PCTemplateNode,
  overrides: PCOverrideNode[]
): PCTemplateNode => {
  for (let i = 0, { length } = overrides; i < length; i++) {
    const override = overrides[i];
    if (override.name === PCSourceTagNames.SET_ATTRIBUTE) {
      const setAttributeOverride = override as PCSetAttributeOverrideNode;
      const ref = getNodeReference(
        setAttributeOverride.attributes.undefined.target,
        template
      );
      template = updateNestedNode(ref, template, ref =>
        setNodeAttribute(
          ref,
          setAttributeOverride.attributes.undefined.name,
          setAttributeOverride.attributes.undefined.value
        )
      );
    } else if (override.name === PCSourceTagNames.SET_STYLE) {
      const setStyleOverride = override as PCSetStyleOverrideNode;
      const ref = getNodeReference(
        setStyleOverride.attributes.undefined.target,
        template
      );
      template = updateNestedNode(ref, template, ref => {
        return setNodeAttribute(ref, "style", {
          ...(getAttribute(ref, "style") || EMPTY_OBJECT),
          [setStyleOverride.attributes.undefined.name]:
            setStyleOverride.attributes.undefined.value
        });
      });
    }
  }

  return template;
};

const evaluateNode = (
  node: PCBaseVisibleNode<any, any>,
  module: PCModuleNode,
  generateId: IDGenerator,
  dependency: Dependency,
  graph: DependencyGraph,
  slots: Slots = EMPTY_OBJECT,
  createdFromComponent?: boolean
) => {
  const nodeDependency = getNodeSourceDependency(node, dependency, graph);
  const nodeComponent = getModuleComponent(node.name, module);

  let { children, attributes } = node;

  let tagName = node.name;
  let hasSlottedChildren = false;
  const containerName = node.attributes.undefined.container;
  const source = getSytheticNodeSource(node, dependency);

  if (containerName) {
    const slotChildren = slots[containerName] || EMPTY_ARRAY;

    if (slotChildren.length > 0) {
      children = slotChildren;
      hasSlottedChildren = true;
    }
  }

  if (node.name === PCSourceTagNames.TEXT) {
    return createSyntheticTextNode(
      {
        [DEFAULT_NAMESPACE]: (node as PCTextNode).attributes.undefined,
        [EDITOR_NAMESPACE]: {}
      },
      source,
      generateId()
    );
  }

  const children2 = hasSlottedChildren
    ? children
    : children.map((child, i) =>
        evaluateNode(
          child,
          module,
          generateId,
          dependency,
          graph,
          slots,
          createdFromComponent
        )
      );

  if (nodeComponent) {
    return _evaluateComponent(
      nodeComponent,
      node.attributes,
      children2,
      source,
      generateId,
      module,
      nodeDependency,
      graph,
      EMPTY_ARRAY,
      false,
      true
    );
  }

  return createSyntheticRectangle(
    merge({}, attributes, {
      [EDITOR_NAMESPACE]: {
        [EditorAttributeNames.CREATED_FROM_COMPONENT]: createdFromComponent
      },
      [DEFAULT_NAMESPACE]: {
        [PCRectangleNodeAttributeNames.NATIVE_TYPE]: tagName
      }
    }),
    children2,
    source,
    generateId()
  );
};
