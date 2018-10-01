import {
  memoize,
  generateUID,
  getTreeNodesByName,
  KeyValue,
  getParentTreeNode,
  EMPTY_OBJECT
} from "tandem-common";
import {
  PCNode,
  getOverrideMap,
  PCOverridablePropertyName,
  PCTextNode,
  PCBaseElementChild,
  isVisibleNode,
  PCComputedOverrideVariantMap,
  PCComponentInstanceElement,
  PCBaseElement,
  PCComponent,
  PCVisibleNode,
  PCSourceTagNames,
  extendsComponent,
  computePCNodeStyle,
  PCModule,
  PCVariant,
  computeStyleWithVars,
  PCOverride,
  PCVariable
} from "./dsl";
import { uniq } from "lodash";
import { SyntheticElement } from "./synthetic";

export type VanillaPCRenderers = KeyValue<VanillaPCRenderer>;
export type VanillaPCRenderer = (
  instanceSourceNodeId: string,
  instancePath: string,
  attributes: any,
  style: any,
  variant: any,
  overrides: any,
  components: VanillaPCRenderers
) => SyntheticElement;

// Note: we're not using immutability here because this thing needs to be _fast_

const merge = (a, b) => {
  if (b == null) return a;
  if (!a || typeof b !== "object" || Array.isArray(b)) return b;
  const clone = { ...a };
  for (const k in b) {
    clone[k] = merge(a[k], b[k]);
  }
  return clone;
};

export const compileContentNodeAsVanilla = memoize(
  (
    node: PCComponent | PCVisibleNode,
    refMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>
  ) => {
    return new Function(
      `generateUID`,
      `merge`,
      `return ` + translateContentNode(node, refMap, varMap)
    )(generateUID, merge);
  }
);

export const translateModuleToVanilla = memoize(
  (
    module: PCModule,
    componentRefMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>
  ) => {
    return module.children
      .filter(child => child.name !== PCSourceTagNames.VARIABLE)
      .map(
        (child: PCComponent | PCVisibleNode) =>
          `exports._${child.id} = ${translateContentNode(
            child,
            componentRefMap,
            varMap
          )}`
      )
      .join("\n");
  }
);

const translateContentNode = memoize(
  (
    node: PCComponent | PCVisibleNode,
    componentRefMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>
  ) => {
    let buffer = `(function() {`;

    buffer += `var EMPTY_ARRAY = [];\n`;
    buffer += `var EMPTY_OBJECT = {};\n`;
    buffer += translateStaticNodeProps(node, componentRefMap, varMap);
    buffer += translateStaticOverrides(node as PCComponent, varMap);
    buffer += translateStaticVariants(node, varMap);

    buffer += `return function(instanceSourceNodeId, instancePath, attributes, style, variant, overrides, components) {
      ${translateVariants(node)}
      var childInstancePath = instancePath == null ? "" : (instancePath ? instancePath + "." : "") + instanceSourceNodeId;
      return ${translateVisibleNode(node, true)};
    }`;

    return buffer + `})()`;
  }
);

const isBaseElement = (node: PCNode): node is PCBaseElement<any> =>
  node.name === PCSourceTagNames.ELEMENT ||
  node.name === PCSourceTagNames.COMPONENT ||
  node.name === PCSourceTagNames.COMPONENT_INSTANCE;

const translateVisibleNode = memoize(
  (node: PCComponent | PCVisibleNode, isContentNode?: boolean) => {
    if (isBaseElement(node)) {
      if (extendsComponent(node)) {
        return `components._${node.is}(${
          isContentNode ? "instanceSourceNodeId" : `"${node.id}"`
        }, ${
          isContentNode ? 'instancePath || ""' : "childInstancePath"
        }, ${translateDynamicAttributes(
          node,
          isContentNode
        )}, ${translateDynamicStyle(
          node,
          isContentNode
        )}, ${translateDynamicVariant(node)}, ${translateDynamicOverrides(
          node as PCComponent
        )}, components)`;
      }

      return `{
      id: generateUID(),
      sourceNodeId: ${isContentNode ? "instanceSourceNodeId" : `"${node.id}"`},
      instancePath: ${
        isContentNode ? 'instancePath || ""' : `childInstancePath`
      },
      name: "${node.is}",
      style: ${translateDynamicStyle(node, isContentNode)},
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
      style: ${translateDynamicStyle(node, isContentNode)},
      instancePath: childInstancePath,
      metadata: EMPTY_OBJECT,
      name: "text",
      value: overrides._${node.id}Value || ${JSON.stringify(node.value)},
      children: EMPTY_ARRAY
    }`;
    }
  }
);
const translateVariants = (contentNode: PCVisibleNode | PCComponent) => {
  const variants = (getTreeNodesByName(
    PCSourceTagNames.VARIANT,
    contentNode
  ) as PCVariant[])
    .concat()
    .reverse();

  let buffer = ``;

  for (const variant of variants) {
    buffer += `if (variant["${variant.id}"]) {`;
    buffer += `overrides = merge(_${contentNode.id}Variants._${
      variant.id
    }, overrides); `;

    buffer += `}\n`;
  }

  return buffer;
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

const translateDynamicAttributes = (
  node: PCBaseElement<any>,
  isContentNode: boolean
) => {
  if (isContentNode) {
    return `overrides._${node.id}Attributes ? Object.assign({}, _${
      node.id
    }Attributes, overrides._${
      node.id
    }Attributes, attributes) : Object.assign({}, _${
      node.id
    }Attributes, attributes)`;
  }

  return `overrides._${node.id}Attributes ? Object.assign({}, _${
    node.id
  }Attributes, overrides._${node.id}Attributes) : _${node.id}Attributes`;
};

const translateDynamicStyle = (
  node: PCBaseElement<any> | PCTextNode,
  isContentNode: boolean
) => {
  if (isContentNode) {
    return `overrides._${node.id}Style ? Object.assign({}, _${
      node.id
    }Style, overrides._${node.id}Style, style) : Object.assign({}, _${
      node.id
    }Style, style)`;
  }

  return `overrides._${node.id}Style ? Object.assign({},  _${
    node.id
  }Style, overrides._${node.id}Style) : _${node.id}Style`;
};

const translateDynamicVariant = (node: PCBaseElement<any>) => {
  return `overrides._${node.id}Variant ? Object.assign({},  _${
    node.id
  }Variant, overrides._${node.id}Variant) : _${node.id}Variant`;
};

const translateDynamicOverrides = (
  node: PCComponent | PCComponentInstanceElement
) => {
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

const translateStaticOverrides = (
  contentNode: PCNode,
  varMap: KeyValue<PCVariable>
) => {
  const instances = [
    ...getTreeNodesByName(PCSourceTagNames.COMPONENT_INSTANCE, contentNode),
    ...getTreeNodesByName(PCSourceTagNames.COMPONENT, contentNode)
  ];

  let buffer = ``;

  for (const instance of instances) {
    const overrideMap = getOverrideMap(instance);
    buffer += `var _${instance.id}Overrides = { ${translateVariantOverrideMap(
      overrideMap.default,
      varMap
    )}};\n`;
  }

  return buffer;
};

const translateStaticVariants = (
  contentNode: PCNode,
  varMap: KeyValue<PCVariable>
) => {
  const variants = getTreeNodesByName(PCSourceTagNames.VARIANT, contentNode);
  const variantNodes: PCNode[] = uniq(
    (getTreeNodesByName(PCSourceTagNames.OVERRIDE, contentNode) as PCOverride[])
      .filter(override => {
        return (
          override.propertyName === PCOverridablePropertyName.STYLE ||
          override.propertyName ===
            PCOverridablePropertyName.VARIANT_IS_DEFAULT ||
          override.propertyName === PCOverridablePropertyName.VARIANT
        );
      })
      .map(override => {
        return getParentTreeNode(override.id, contentNode);
      })
  );

  let buffer = `_${contentNode.id}Variants = {`;

  for (const variant of variants) {
    buffer += `_${variant.id}: {`;
    for (const node of variantNodes) {
      const overrideMap = getOverrideMap(
        node,
        node.name === PCSourceTagNames.COMPONENT_INSTANCE ||
          node.name === PCSourceTagNames.COMPONENT
      );
      if (!overrideMap[variant.id]) {
        continue;
      }
      buffer += `${translateVariantOverrideMap(
        overrideMap[variant.id],
        varMap
      )}`;
    }
    buffer += `},`;
  }

  return buffer + `};\n`;
};

const translateVariantOverrideMap = memoize(
  (map: PCComputedOverrideVariantMap, varMap: KeyValue<PCVariable>) => {
    let buffer = ``;
    for (const nodeId in map) {
      const { overrides, children: childMap } = map[nodeId];

      for (const override of overrides) {
        if (override.propertyName === PCOverridablePropertyName.STYLE) {
          buffer += `_${nodeId}Style: ${JSON.stringify(
            computeStyleWithVars(override.value, varMap)
          )},`;
        }
        if (override.propertyName === PCOverridablePropertyName.ATTRIBUTES) {
          buffer += `_${nodeId}Attributes: ${JSON.stringify(override.value)},`;
        }
        if (override.propertyName === PCOverridablePropertyName.VARIANT) {
          buffer += `_${nodeId}Variant: ${JSON.stringify(override.value)},`;
        }
        if (override.propertyName === PCOverridablePropertyName.TEXT) {
          buffer += `_${nodeId}Value: ${JSON.stringify(override.value)},`;
        }
      }
      buffer += `_${nodeId}Overrides: {`;

      buffer += translateVariantOverrideMap(childMap, varMap);

      buffer += `},`;
    }

    return buffer + ``;
  }
);

const translateStaticNodeProps = memoize(
  (
    node: PCNode,
    componentRefMap: KeyValue<PCComponent>,
    varMap: KeyValue<PCVariable>
  ) => {
    let buffer = "";

    if (isBaseElement(node)) {
      buffer += `var _${node.id}Attributes = {\n`;
      for (const name in node.attributes) {
        buffer += `"${name}": "${node.attributes[name]}",\n`;
      }
      buffer += `};\n`;
    }

    if (isBaseElement(node) || node.name === PCSourceTagNames.TEXT) {
      buffer += `var _${node.id}Style = ${JSON.stringify(
        computePCNodeStyle(node, componentRefMap, varMap)
      )};`;
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
        varMap
      );
    }

    return buffer;
  }
);
