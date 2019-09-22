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
  PCOverridableType,
  getPCVariants
} from "./dsl";
import {
  memoize,
  KeyValue,
  filterNestedNodes,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  addProtocol,
  FILE_PROTOCOL,
  stripProtocol
} from "tandem-common";
import { overridesToTargetMap, ComputedOverrideMap } from "./overrides";
import * as path from "path";

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
  ) => {
    return module.children
      .filter(
        child =>
          child.name !== PCSourceTagNames.VARIABLE &&
          child.name !== PCSourceTagNames.QUERY
      )
      .map(
        (child: PCComponent | PCVisibleNode | PCStyleMixin) =>
          `exports._${child.id} = ${translateContentNode(
            child,
            componentRefMap,
            varMap,
            queryMap,
            sourceUri,
            rootDirectory
          )}`
      )
      .join("\n");
  }
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
    )(merge);
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
    buffer += translateStaticNodeProps(
      node,
      componentRefMap,
      varMap,
      sourceUri,
      rootDirectory
    );

    buffer += ` return function(instanceSourceNodeId, instancePath, attributes, className, variant, overrides, windowInfo, components, isRoot) {

      var childInstancePath = instancePath == null ? "" : (instancePath ? instancePath + "." : "") + instanceSourceNodeId;

      ${translateClassNames(node, true)}
      
      return ${translateVisibleNode(node, true)};
    }`;

    return buffer + `})()`;
  }
);

const translateAllOverrides = (contentNode: PCContentNode) => {
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
        }, ${translateDynamicAttributes(node, isContentNode)}, _${
          node.id
        }ClassName, ${translateDynamicVariant(node as
          | PCComponent
          | PCComponentInstanceElement)}, ${translatePlugs(
          node as PCComponent
        )}, windowInfo, components, ${isContentNode ? "isRoot" : "false"})`;
      }

      return `{
      id: "synthetic-dom-${node.id}" + childInstancePath,
      sourceNodeId: ${isContentNode ? "instanceSourceNodeId" : `"${node.id}"`},
      instancePath: ${
        isContentNode ? 'instancePath || ""' : `childInstancePath`
      },
      name: "${node.is}",
      className: _${node.id}ClassName,
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
      id: "synthetic-dom-${node.id}" + childInstancePath,
      sourceNodeId: "${node.id}",
      className: _${node.id}ClassName,
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
          id: "synthetic-dom-${node.id}" + childInstancePath,
          sourceNodeId: "${node.id}",
          className: _${node.id}ClassName,
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
          id: "synthetic-dom-${node.id}" + childInstancePath,
          sourceNodeId: "${node.id}",
          className: _${node.id}ClassName,
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

const translateClassNames = (
  node: PCNode | PCComponent,
  isContentNode: boolean = false
) => {
  let buffer = "";

  if (isVisibleNode(node) || node.name === PCSourceTagNames.COMPONENT) {
    buffer += `
    var _${node.id}ClassName = "";

    if (overrides._${node.id}Overrides && overrides._${
      node.id
    }Overrides.className) {
      _${node.id}ClassName = overrides._${node.id}Overrides.className + " ";
    }

    _${node.id}ClassName += "_${node.id}";

    `;

    if (isContentNode) {
      buffer += `
        _${
          node.id
        }ClassName += " " + className + " " + Object.keys(variant).filter(id => variant[id]).map(id => "_" + id).join(" ");
      `;
    }
  }

  for (const child of node.children as any) {
    buffer += translateClassNames(child);
  }
  return buffer;
};

const translateDynamicVariant = (
  node: PCComponentInstanceElement | PCComponent
) => {
  return `overrides._${node.id}Overrides && overrides._${
    node.id
  }Overrides.variant ? Object.assign({}, _${node.id}Variant, overrides._${
    node.id
  }Overrides.variant) : _${node.id}Variant`;
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

const translateStaticNodeProps = memoize(
  (
    node: PCNode,
    componentRefMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>,
    sourceUri: string,
    rootDirectory: string
  ) => {
    let buffer = "";

    if (isBaseElement(node)) {
      buffer += `var _${node.id}Attributes = {\n`;
      for (let { key, value } of node.attributes) {
        if (node.is === "img" && !/\w+:\/\//.test(value)) {
          path;
          value = addProtocol(
            FILE_PROTOCOL,
            path.resolve(path.dirname(stripProtocol(sourceUri)), value)
          );
        }

        buffer += `"${key}": ${JSON.stringify(value)},\n`;
      }
      buffer += `};\n`;
    }

    if (
      node.name === PCSourceTagNames.COMPONENT_INSTANCE ||
      node.name === PCSourceTagNames.COMPONENT
    ) {
      buffer += `var _${node.id}Variant = ${JSON.stringify(
        (node as any).variant || EMPTY_OBJECT
      )};`;
    }

    for (const child of node.children) {
      buffer += translateStaticNodeProps(
        child as PCNode,
        componentRefMap,
        varMap,
        sourceUri,
        rootDirectory
      );
    }

    return buffer;
  }
);

const translateDynamicAttributes = (
  node: PCBaseElement<any>,
  isContentNode: boolean
) => {
  if (isContentNode) {
    return `overrides._${node.id}Overrides && overrides._${
      node.id
    }Overrides.attributes ? Object.assign({}, _${
      node.id
    }Attributes, overrides._${
      node.id
    }Overrides.attributes, attributes) : Object.assign({}, _${
      node.id
    }Attributes, attributes)`;
  }

  return `overrides._${node.id}Attributes ? Object.assign({}, _${
    node.id
  }Attributes, overrides._${node.id}Attributes) : _${node.id}Attributes`;
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
