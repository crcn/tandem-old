import * as xml from "xml-js";
import {
  createPCTextNode,
  createPCElement,
  PCModule,
  PCTextStyleMixin,
  PCSourceTagNames,
  TEXT_STYLE_NAMES,
  CSS_COLOR_ALIASES,
  PCVisibleNodeMetadataKey,
  createPCTextStyleMixin,
  PCNode,
  createPCVariable,
  PCVariableType,
  PCVariable,
  PCStyleMixin
} from "./dsl";
import {
  EMPTY_ARRAY,
  appendChildNode,
  KeyValue,
  EMPTY_OBJECT
} from "tandem-common";

const FRAME_PADDING = 50;

// TODO - check for SVG and convert props to style
export const xmlToPCNode = (source: string) => {
  const {
    elements: [root]
  } = JSON.parse(xml.xml2json(source)) as any;
  return convertXMLJSONToPCNode(root);
};

const convertXMLJSONToPCNode = node => {
  if (node.type === "element") {
    return createPCElement(
      node.name,
      {},
      node.attributes,
      (node.elements || EMPTY_ARRAY).map(convertXMLJSONToPCNode)
    );
  } else if (node.type === "text") {
    return createPCTextNode(node.text);
  } else {
    console.error(node);
    throw new Error("Unsupported");
  }
};

export const elevateCommonStylesToGlobal = (root: PCModule) => {
  root = elevateColorsToGlobal(root);

  // don't do this for now because it causes messiness. Instead focus on
  // tooling that makes it easier to elevate typography to mixins.
  root = elevateTypographyToMixins(root);
  return root;
};

export const elevateColorsToGlobal = (root: PCModule) => {
  const colorVarMap: KeyValue<PCVariable> = {};

  for (const child of root.children) {
    if (
      child.name === PCSourceTagNames.VARIABLE &&
      (child as PCVariable).type === PCVariableType.COLOR
    ) {
      colorVarMap[(child as PCVariable).value] = child as PCVariable;
    }
  }

  const moveColorsToMap = (node: PCNode) => {
    if (
      node.name === PCSourceTagNames.ELEMENT ||
      node.name === PCSourceTagNames.TEXT
    ) {
      let newStyle;
      for (const key in node.style) {
        let value: string = node.style[key];
        const colors = findCSSColors(node.style[key]);
        if (colors.length) {
          if (!newStyle) {
            newStyle = { ...node.style };
          }

          for (const color of colors) {
            const colorVar: PCVariable =
              colorVarMap[color] ||
              (colorVarMap[color] = createPCVariable(
                `Color ${Object.keys(colorVarMap).length + 1}`,
                PCVariableType.COLOR,
                color
              ));
            value = value.replace(color, `var(--${colorVar.id})`);
          }

          newStyle[key] = value;
        }
      }

      if (newStyle) {
        node = {
          ...node,
          style: newStyle
        };
      }
    }

    if (node.children.length) {
      return {
        ...node,
        children: node.children.map(moveColorsToMap)
      };
    }

    return node;
  };
  root = moveColorsToMap(root);

  for (const color in colorVarMap) {
    const pcVar = colorVarMap[color];
    root = appendChildNode(pcVar, root);
  }

  return root;
};

export const elevateTypographyToMixins = (root: PCModule) => {
  const typographyMixinMap: KeyValue<PCTextStyleMixin> = {};

  for (const child of root.children) {
    if (
      child.name === PCSourceTagNames.STYLE_MIXIN &&
      (child as PCStyleMixin).targetType === PCSourceTagNames.TEXT
    ) {
      const styleMixin = child as PCTextStyleMixin;
      typographyMixinMap[JSON.stringify(styleMixin.style)] = styleMixin;
    }
  }

  const moveTypographyToMap = (node: PCNode) => {
    if (
      node.name === PCSourceTagNames.ELEMENT ||
      node.name === PCSourceTagNames.TEXT
    ) {
      const typographyStyle = {};
      const otherStyle = {};
      for (const key in node.style) {
        if (TEXT_STYLE_NAMES.indexOf(key) !== -1) {
          typographyStyle[key] = node.style[key];
        } else {
          otherStyle[key] = node.style[key];
        }
      }
      if (Object.keys(typographyStyle).length) {
        const key = JSON.stringify(typographyStyle);
        const mixin =
          typographyMixinMap[key] ||
          (typographyMixinMap[key] = createPCTextStyleMixin(
            typographyStyle,
            `Text Style ${Object.keys(typographyStyle).length + 1}`
          ));
        node = {
          ...node,
          style: otherStyle,
          styleMixins: {
            ...(node.styleMixins || EMPTY_OBJECT),
            [mixin.id]: {
              priority: 1
            }
          }
        };
      }
    }

    if (node.children.length) {
      return {
        ...node,
        children: node.children.map(moveTypographyToMap)
      };
    }

    return node;
  };

  root = moveTypographyToMap(root);

  let i = 0;

  for (const key in typographyMixinMap) {
    let mixin = typographyMixinMap[key];
    const size = 100;
    const left = i++ * (size + FRAME_PADDING);
    const top = -(size + FRAME_PADDING);
    mixin = {
      ...mixin,
      metadata: {
        ...mixin.metadata,
        [PCVisibleNodeMetadataKey.BOUNDS]: {
          left,
          top,
          right: left + size,
          bottom: top + size
        }
      }
    };

    root = appendChildNode(mixin, root);
  }

  return root;
};

const COLOR_REGEXP = new RegExp(
  `(rgba?|hsla?)\\(.*?\\)|#[^\\s]+|${Object.keys(CSS_COLOR_ALIASES).join("|")}`,
  "gi"
);

// TODO - need to get map of all css colors
const findCSSColors = (value: string) => {
  return String(value).match(COLOR_REGEXP) || EMPTY_ARRAY;
};
