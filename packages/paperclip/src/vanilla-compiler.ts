import {
  memoize,
  generateUID,
  getTreeNodesByName,
  KeyValue
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
  PCModule,
  PCComponent,
  getOverrides,
  PCVisibleNode,
  PCSourceTagNames,
  extendsComponent,
  ComponentRef
} from "./dsl";
import { DependencyGraph } from "./graph";
import { SyntheticElement } from "./synthetic";

export type VanillaPCComponents = KeyValue<VanillaPCComponent>;
export type VanillaPCComponent = (
  overrides: any,
  components: VanillaPCComponents
) => SyntheticElement;

// Note: we're not using immutability here because this thing needs to be _fast_

export const compileComponentRefMap = memoize(
  (refMap: KeyValue<PCComponent>): VanillaPCComponents => {
    const map: VanillaPCComponents = {};

    for (const nodeId in refMap) {
      map[`_` + nodeId] = compileContentNodeAsVanilla(refMap[nodeId]);
    }

    return map;
  }
);

export const compileContentNodeAsVanilla = memoize(
  (node: PCComponent | PCVisibleNode) => {
    return new Function(`generateUID`, `return ` + translateContentNode(node))(
      generateUID
    );
  }
);

const translateContentNode = memoize((node: PCComponent | PCVisibleNode) => {
  let buffer = `(function() {`;

  buffer += `const EMPTY_ARRAY = [];\n`;
  buffer += `const EMPTY_OBJECT = {};\n`;
  buffer += translateStaticNodeProps(node);
  buffer += translateStaticOverrides(node);

  buffer += `return function(overrides, components) {
      return ${translateVisibleNode(node)};
    }`;

  return buffer + `})()`;
});

const isBaseElement = (node: PCNode): node is PCBaseElement<any> =>
  node.name === PCSourceTagNames.ELEMENT ||
  node.name === PCSourceTagNames.COMPONENT ||
  node.name === PCSourceTagNames.COMPONENT_INSTANCE;

const translateVisibleNode = memoize((node: PCComponent | PCVisibleNode) => {
  if (isBaseElement(node)) {
    if (extendsComponent(node)) {
      return `components._${node.is}(${translateDynamicOverrides(
        node as PCComponent
      )}, components)`;
    }

    return `{
      id: generateUID(),
      sourceNodeId: "${node.id}",
      name: "${node.is}",
      style: ${translateDynamicStyle(node)},
      metadata: EMPTY_OBJECT,
      attributes: ${translateDynamicAttributes(node)},
      children: [${node.children
        .map(translateElementChild)
        .filter(Boolean)
        .join(",")}]
    }`;
  } else if (node.name === PCSourceTagNames.TEXT) {
    return `{
      id: generateUID(),
      sourceNodeId: "${node.id}",
      style: ${translateDynamicStyle(node)},
      metadata: EMPTY_OBJECT,
      name: "text",
      value: overrides._${node.id} || ${JSON.stringify(node.value)},
      children: EMPTY_ARRAY
    }`;
  }
});

const translateElementChild = memoize((node: PCBaseElementChild) => {
  if (node.name === PCSourceTagNames.SLOT) {
    return `...(overrides._${node.id}Children || EMPTY_ARRAY)`;
  } else if (isVisibleNode(node)) {
    return translateVisibleNode(node);
  } else {
    // console.warn(`Cannot compile ${node.name}`);
  }
});

const translateDynamicAttributes = (node: PCBaseElement<any>) => {
  return `overrides._${node.id}Attributes ? Object.assign({}, _${
    node.id
  }Attributes, overrides._${node.id}Attributes) : _${node.id}Attributes`;
};

const translateDynamicStyle = (node: PCBaseElement<any> | PCTextNode) => {
  return `overrides._${node.id}Style ? Object.assign({}, _${
    node.id
  }Style, overrides._${node.id}Style) : _${node.id}Style`;
};

const translateDynamicOverrides = (
  node: PCComponent | PCComponentInstanceElement
) => {
  let buffer = `Object.assign({}, overrides._${node.id}Overrides, _${
    node.id
  }Overrides._default, {`;

  for (const child of node.children as PCNode[]) {
    if (child.name === PCSourceTagNames.PLUG) {
      buffer += `_${child.slotId}Children: [${child.children
        .map(translateElementChild)
        .filter(Boolean)
        .join(",")}],\n`;
    }
  }

  return buffer + `})`;
};

const translateStaticOverrides = (node: PCNode) => {
  const instances = [
    ...getTreeNodesByName(PCSourceTagNames.COMPONENT_INSTANCE, node),
    ...getTreeNodesByName(PCSourceTagNames.COMPONENT, node)
  ];
  return instances.map(translateComponentInstanceOverrides).join("\n");
};

const translateComponentInstanceOverrides = memoize(
  (instance: PCComponentInstanceElement) => {
    const overrides = getOverrides(instance);
    const overrideMap = getOverrideMap(overrides);
    let buffer = `const _${instance.id}Overrides = {`;

    for (const variantId in overrideMap) {
      buffer += `_${variantId}: {${translateVariantOverrideMap(
        overrideMap[variantId]
      )}},\n`;
    }

    return buffer + `};\n`;
  }
);

const translateVariantOverrideMap = memoize(
  (map: PCComputedOverrideVariantMap) => {
    let buffer = ``;
    for (const nodeId in map) {
      buffer += `_${nodeId}Overrides: {`;
      const { overrides, children: childMap } = map[nodeId];

      for (const override of overrides) {
        const targetId =
          override.targetIdPath[override.targetIdPath.length - 1];
        if (override.propertyName === PCOverridablePropertyName.STYLE) {
          buffer += `_${targetId}Style: ${JSON.stringify(override.value)},`;
        }
        if (override.propertyName === PCOverridablePropertyName.STYLE) {
          buffer += `_${targetId}Attributes: ${JSON.stringify(
            override.value
          )},`;
        }
        if (override.propertyName === PCOverridablePropertyName.TEXT) {
          buffer += `_${targetId}Value: ${JSON.stringify(override.value)},`;
        }
      }
      buffer += translateVariantOverrideMap(childMap);

      buffer += `},`;
    }

    return buffer + ``;
  }
);

const translateStaticNodeProps = memoize((node: PCNode) => {
  let buffer = "";

  if (isBaseElement(node)) {
    buffer += `const _${node.id}Attributes = {\n`;
    for (const name in node.attributes) {
      buffer += `"${name}": "${node.attributes[name]}",\n`;
    }
    buffer += `};\n`;
  }

  if (isBaseElement(node) || node.name === PCSourceTagNames.TEXT) {
    buffer += `const _${node.id}Style = {\n`;
    for (const name in node.style) {
      buffer += `"${name}": "${node.style[name]}",\n`;
    }
    buffer += `};\n`;
  }

  for (const child of node.children) {
    buffer += translateStaticNodeProps(child);
  }

  return buffer;
});
