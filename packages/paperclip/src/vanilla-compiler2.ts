import {
  PCModule,
  PCComponent,
  PCVariable,
  PCQuery,
  PCVisibleNode,
  PCStyleMixin,
  PCContentNode,
  PCBaseElementChild,
  PCSourceTagNames,
  isVisibleNode,
  PCNode,
  PCBaseElement,
  extendsComponent,
  PCComponentInstanceElement,
  PCTextNode,
  PCTextStyleMixin,
  PCElementStyleMixin,
  isComponentLike,
  PCOverride,
  PCOverridableType
} from "./dsl";
import {
  memoize,
  KeyValue,
  generateUID,
  filterNestedNodes,
  EMPTY_ARRAY
} from "tandem-common";
import {
  overridesToTargetMap,
  ComputedNodeOverrideMap,
  ComputedOverrideMap
} from "./overrides";

const merge = (a, b) => {
  if (b == null) return a;
  if (!a || typeof b !== "object" || Array.isArray(b)) return b;
  const clone = { ...a };
  for (const k in b) {
    clone[k] = merge(a[k], b[k]);
  }
  return clone;
};

export const translateModuleToVanillaRenderer = memoize(
  (
    module: PCModule,
    componentRefMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>,
    queryMap: KeyValue<PCQuery>,
    sourceUri: string,
    rootDirectory: string
  ) => {}
);

export const compileContentNodeToVanillaRenderer = memoize(
  (
    node: PCContentNode,
    componentRefMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>,
    queryMap: KeyValue<PCQuery>,
    sourceUri: string,
    rootDirectory: string
  ) => {
    return new Function(
      `generateUID`,
      `merge`,
      `return ` +
        translateContentNode(
          node,
          componentRefMap,
          varMap,
          queryMap,
          sourceUri,
          rootDirectory
        )
    )(generateUID, merge);
  }
);

const translateContentNode = memoize(
  (
    node: PCComponent | PCVisibleNode | PCStyleMixin,
    componentRefMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>,
    queryMap: KeyValue<PCQuery>,
    sourceUri: string,
    rootDirectory: string
  ) => {
    let buffer = `(function() {`;

    buffer += `var EMPTY_ARRAY = [];\n`;
    buffer += `var EMPTY_OBJECT = {};\n`;

    buffer += translateAllOverrides(node);

    buffer += ` return function(instanceSourceNodeId, instancePath, attributes, className, variant, overrides, windowInfo, components, isRoot) {

      var childInstancePath = instancePath == null ? "" : (instancePath ? instancePath + "." : "") + instanceSourceNodeId;
      
      return ${translateVisibleNode(node, true)};
    }`;

    return buffer + `})()`;
  }
);

const translateAllOverrides = (
  contentNode: PCComponent | PCVisibleNode | PCStyleMixin
) => {
  const instanceNodes = filterNestedNodes(contentNode, isComponentLike) as (
    | PCComponent
    | PCComponentInstanceElement)[];

  let buffer = "";

  for (const instanceNode of instanceNodes) {
    buffer += translateInstanceOverrides(instanceNode);
  }

  return buffer;
};

const translateInstanceOverrides = (
  instanceNode: PCComponent | PCComponentInstanceElement
) => {
  let buffer = `var _${instanceNode.id}Overrides = {\n`;
  buffer += translateOverrideMap(overridesToTargetMap(instanceNode.overrides));
  buffer += "};\n\n";
  return buffer;
};

const translateOverrideMap = (
  childMap: ComputedOverrideMap,
  overrides: PCOverride[] = EMPTY_ARRAY
) => {
  let buffer = "";

  for (const override of overrides) {
    buffer += translateOverride(override);
  }

  for (const nodeId in childMap) {
    buffer += `_${nodeId}Overrides: {\n`;
    const selfMap = childMap[nodeId];
    buffer += translateOverrideMap(selfMap.children, selfMap.overrides);
    buffer += `},`;
  }
  return buffer;
};

const translateOverride = (override: PCOverride) => {
  let buffer = "";

  switch (override.type) {
    case PCOverridableType.STYLES: {
      buffer += `className: "_${override.id}",\n`;
      break;
    }
    case PCOverridableType.TEXT: {
      buffer += `value: ${JSON.stringify(override.value)},\n`;
      break;
    }
    case PCOverridableType.VARIANT: {
      buffer += `variant: ${JSON.stringify(override.value)},\n`;
      break;
    }
  }

  return buffer;
};

const isBaseElement = (node: PCNode): node is PCBaseElement<any> =>
  node.name === PCSourceTagNames.ELEMENT ||
  node.name === PCSourceTagNames.COMPONENT ||
  node.name === PCSourceTagNames.COMPONENT_INSTANCE;

const translateVisibleNode = memoize(
  (
    node: PCComponent | PCStyleMixin | PCVisibleNode,
    isContentNode?: boolean
  ) => {
    if (isBaseElement(node)) {
      if (extendsComponent(node)) {
        return `components._${node.is}(${
          isContentNode ? "instanceSourceNodeId" : `"${node.id}"`
        }, ${
          isContentNode ? 'instancePath || ""' : "childInstancePath"
        }, ${translateDynamicAttributes(
          node,
          isContentNode
        )}, ${translateDynamicClassName(
          node,
          isContentNode
        )}, ${translateDynamicVariant(node)}, ${translatePlugs(
          node as PCComponent
        )}, windowInfo, components, ${isContentNode ? "isRoot" : "false"})`;
      }

      return `{
      id: generateUID(),
      sourceNodeId: ${isContentNode ? "instanceSourceNodeId" : `"${node.id}"`},
      instancePath: ${
        isContentNode ? 'instancePath || ""' : `childInstancePath`
      },
      name: "${node.is}",
      className: ${translateDynamicClassName(node, isContentNode)},
      style: EMPTY_OBJECT,
      metadata: EMPTY_OBJECT,
      attributes: ${translateDynamicAttributes(node, isContentNode)},
      children: [${node.children
        .map(translateElementChild)
        .filter(Boolean)
        .join(",")}]
    }`;
    } else if (node.name === PCSourceTagNames.TEXT) {
      return `{
      id: generateUID(),
      sourceNodeId: "${node.id}",
      className: ${translateDynamicClassName(node, isContentNode)},
      style: EMPTY_OBJECT,
      instancePath: childInstancePath,
      metadata: EMPTY_OBJECT,
      name: "text",
      value: overrides._${node.id}Overrides && overrides._${
        node.id
      }Overrides.value || ${JSON.stringify(node.value)},
      children: EMPTY_ARRAY
    }`;
    } else if (node.name === PCSourceTagNames.STYLE_MIXIN) {
      // note that element style mixins have children here since they _may_ be used to style "parts"
      // in the future.
      if (node.targetType === PCSourceTagNames.ELEMENT) {
        return `{
          id: generateUID(),
          sourceNodeId: "${node.id}",
          className: ${translateDynamicClassName(node, isContentNode)},
          style: EMPTY_OBJECT,
          instancePath: childInstancePath,
          metadata: EMPTY_OBJECT,
          name: "element",
          attributes: EMPTY_OBJECT,
          children: [${node.children
            .map(translateElementChild)
            .filter(Boolean)
            .join(",")}]
        }`;
      } else if (node.targetType === PCSourceTagNames.TEXT) {
        return `{
          id: generateUID(),
          sourceNodeId: "${node.id}",
          className: ${translateDynamicClassName(node, isContentNode)},
          style: EMPTY_OBJECT,
          instancePath: childInstancePath,
          metadata: EMPTY_OBJECT,
          name: "text",
          value: ${JSON.stringify(node.value)},
          children: EMPTY_ARRAY
        }`;
      }
    }
  }
);

const translateDynamicVariant = (node: PCBaseElement<any>) => {
  return `{}`;

  // return `overrides._${node.id}Variant ? Object.assign({},  _${
  //   node.id
  // }Variant, overrides._${node.id}Variant) : _${node.id}Variant`;
};

const translateDynamicClassName = (
  node: PCVisibleNode | PCTextStyleMixin | PCElementStyleMixin | PCComponent,
  isContentNode: boolean
) => {
  let buffer = `"_${node.id}"`;

  return `(overrides._${node.id}Overrides && overrides._${
    node.id
  }Overrides.className ? overrides._${
    node.id
  }Overrides.className + " " : "") + "_${node.id}"`;
};

const translatePlugs = (node: PCComponent | PCComponentInstanceElement) => {
  let buffer = `merge(_${node.id}Overrides, merge(merge(overrides._${
    node.id
  }Overrides, overrides), {`;
  for (const child of node.children as PCNode[]) {
    if (child.name === PCSourceTagNames.PLUG && child.children.length) {
      buffer += `_${child.slotId}Children: [${child.children
        .map(translateElementChild)
        .filter(Boolean)
        .join(",")}],\n`;
    }
  }

  return buffer + `}))`;
};

const translateDynamicAttributes = (
  node: PCBaseElement<any>,
  isContentNode: boolean
) => {
  return `{}`;
  // if (isContentNode) {
  //   return `overrides._${node.id}Attributes ? Object.assign({}, _${
  //     node.id
  //   }Attributes, overrides._${
  //     node.id
  //   }Attributes, attributes) : Object.assign({}, _${
  //     node.id
  //   }Attributes, attributes)`;
  // }

  // return `overrides._${node.id}Attributes ? Object.assign({}, _${
  //   node.id
  // }Attributes, overrides._${node.id}Attributes) : _${node.id}Attributes`;
};

const translateDynamicStyle = (
  node: PCBaseElement<any> | PCTextNode | PCStyleMixin,
  isContentNode: boolean
) => {
  return `{}`;

  // if (isContentNode) {
  //   return `overrides._${node.id}Style ? Object.assign({}, _${
  //     node.id
  //   }Style, overrides._${node.id}Style, style) : Object.assign({}, _${
  //     node.id
  //   }Style, style)`;
  // }

  // return `overrides._${node.id}Style ? Object.assign({},  _${
  //   node.id
  // }Style, overrides._${node.id}Style) : _${node.id}Style`;
};

const translateElementChild = memoize((node: PCBaseElementChild) => {
  if (node.name === PCSourceTagNames.SLOT) {
    return `...(overrides._${node.id}Children || [${node.children
      .map(translateElementChild)
      .filter(Boolean)
      .join(",")}])`;
  } else if (isVisibleNode(node)) {
    return translateVisibleNode(node);
  } else {
    // console.warn(`Cannot compile ${node.name}`);
  }
});
