import * as figma from "figma-js";
import fetch from "node-fetch";
import * as mime from "mime";
import {
  BaseDesign,
  DesignType,
  ConversionOptions,
  ConvertResult,
  ConvertResultItem,
  getResultItemBasename
} from "./base";
import {
  PCModule,
  createPCModule,
  PCSourceTagNames,
  xmlToPCNode,
  PAPERCLIP_MODULE_VERSION,
  PCVisibleNodeMetadataKey,
  PCElement,
  PCNode,
  PCComponent
} from "paperclip";
import { kebabCase } from "lodash";
import {
  KeyValue,
  EMPTY_OBJECT,
  appendChildNode,
  EMPTY_ARRAY,
  Point,
  shiftPoint,
  flipPoint
} from "tandem-common";
import { px } from "./utils";

export type FigmaDesign = {
  document: figma.Document;
  components: KeyValue<figma.Component>;
  images: KeyValue<ConvertResultItem>;
} & BaseDesign<DesignType.FIGMA>;

type FigmaOpenOptions = {
  figmaToken: string;
};

export const isSupportedPath = (
  projectId: string,
  options: { figmaToken?: string }
): options is FigmaOpenOptions => Boolean(options.figmaToken);

export const openDesign = async (
  projectId: string,
  { figmaToken }: FigmaOpenOptions
): Promise<FigmaDesign> => {
  const client = figma.Client({
    personalAccessToken: figmaToken
  });

  console.log(`Loading figma project: ${projectId}`);

  const {
    data: { document, components }
  } = await client.file(projectId);

  let imageIds: string[] = getFigmaImageIds([], document);
  imageIds = Object.values(components).reduce(getFigmaImageIds, imageIds);

  let loadedImages: KeyValue<ConvertResultItem> = {};

  if (imageIds.length) {
    console.log(
      `Loading ${imageIds.length} image${imageIds.length > 1 ? "s" : ""}`
    );

    const {
      data: { images }
    } = await client.fileImages(projectId, {
      ids: imageIds,
      scale: 1,
      format: "svg",
      svg_include_id: true
    });

    for (const imageId in images) {
      const url = images[imageId];
      console.log(`Downloading: ${url}`);
      const response = await fetch(url);
      const data = await new Promise<ConvertResultItem>(resolve => {
        let buffers = [];
        response.headers.get;
        response.body.on("data", chunk => {
          buffers.push(chunk);
        });
        response.body.on("end", () => {
          resolve({
            name: imageId,
            extension: mime.getExtension(response.headers.get("Content-Type")),
            content: Buffer.concat(buffers)
          });
        });
      });

      loadedImages[imageId] = data;
    }
  }

  return {
    document,
    components,
    images: loadedImages,
    type: DesignType.FIGMA
  };
};

const figmaNodeReducer = <T>(
  reduce: (value: T, node: figma.Node | figma.Component) => T
) => {
  const iter = (value: T, node: figma.Node) => {
    value = reduce(value, node);
    switch (node.type) {
      case "DOCUMENT":
      case "CANVAS":
      case "GROUP":
      case "FRAME": {
        value = node.children.reduce(iter, value);
        break;
      }
    }
    return value;
  };
  return iter;
};
// const { data } = await client.projectFiles(projectId);
const getFigmaImageIds = figmaNodeReducer((vectorIds: string[], node) => {
  let imageRefId: string;
  if (node.type === "VECTOR") {
    imageRefId = node.id;
  } else if (node.type === "RECTANGLE") {
    const fills = node.fills || EMPTY_ARRAY;
    for (const fill of fills) {
      if (fill.type === "IMAGE") {
        imageRefId = node.id;
        break;
      }
    }
  }
  if (imageRefId && vectorIds.indexOf(imageRefId) === -1) {
    return [...vectorIds, imageRefId];
  }

  return vectorIds;
});

export const convertDesign = async (
  design: FigmaDesign,
  options: ConversionOptions
): Promise<ConvertResult> => {
  const { document, components, images } = design;
  const modules = convertDocument(document, design);

  const result: ConvertResultItem[] = Object.values(images);

  for (const pageName in modules) {
    result.push({
      name: pageName,
      extension: "pc",
      content: new Buffer(JSON.stringify(modules[pageName], null, 2))
    });
  }

  return result;
};

const convertDocument = (document: figma.Document, design: FigmaDesign) => {
  const modules: KeyValue<PCModule> = {};
  for (const child of document.children) {
    if (child.type === "CANVAS") {
      modules[child.name] = convertFigmaNode({ left: 0, top: 0 }, design)(
        child
      );
    }
  }

  return modules;
};

const convertFigmaNode = (offsetPosition: Point, design: FigmaDesign) => (
  node: figma.Node
) => {
  let pcNode: PCNode;

  switch (node.type) {
    case "CANVAS": {
      pcNode = {
        id: node.id,
        name: PCSourceTagNames.MODULE,
        metadata: EMPTY_OBJECT,
        version: PAPERCLIP_MODULE_VERSION,
        children: node.children
          .map(convertFigmaNode(offsetPosition, design))
          .filter(Boolean)
      };
      break;
    }
    case "FRAME": {
      const position = shiftPoint(
        getFigmaNodePoint(node),
        flipPoint(offsetPosition)
      );

      pcNode = {
        id: node.id,
        is: "div",
        attributes: EMPTY_OBJECT,
        label: node.name,
        metadata: {
          [PCVisibleNodeMetadataKey.BOUNDS]: {
            left: node.absoluteBoundingBox.x,
            top: node.absoluteBoundingBox.y,
            right: node.absoluteBoundingBox.x + node.absoluteBoundingBox.width,
            bottom: node.absoluteBoundingBox.y + node.absoluteBoundingBox.height
          }
        },
        name: PCSourceTagNames.ELEMENT,
        style: convertFrameStyle(node),
        children: node.children
          .map(convertFigmaNode(shiftPoint(position, offsetPosition), design))
          .filter(Boolean)
      };
      break;
    }
    case "RECTANGLE": {
      const position = shiftPoint(
        getFigmaNodePoint(node),
        flipPoint(offsetPosition)
      );

      pcNode = {
        id: node.id,
        is: "div",
        attributes: EMPTY_OBJECT,
        name: PCSourceTagNames.ELEMENT,
        children: EMPTY_ARRAY,
        metadata: EMPTY_OBJECT,
        label: node.name,
        style: convertRectangleStyle(node, design, position)
      };
      break;
    }
    case "GROUP": {
      const position = shiftPoint(
        getFigmaNodePoint(node),
        flipPoint(offsetPosition)
      );
      pcNode = {
        id: node.id,
        is: "div",
        attributes: EMPTY_OBJECT,
        name: PCSourceTagNames.ELEMENT,
        children: node.children
          .map(convertFigmaNode(shiftPoint(position, offsetPosition), design))
          .filter(Boolean),
        metadata: EMPTY_OBJECT,
        label: node.name,
        style: convertGroupStyle(node, position)
      };
      break;
    }
    case "TEXT": {
      const position = shiftPoint(
        getFigmaNodePoint(node),
        flipPoint(offsetPosition)
      );
      pcNode = {
        id: node.id,
        label: node.name,
        name: PCSourceTagNames.TEXT,
        // value: node.
        value: node.characters,
        children: EMPTY_ARRAY,
        metadata: EMPTY_OBJECT,
        style: convertTextStyle(node, position)
      };
      break;
    }
    case "VECTOR": {
      const image = design.images[node.id].content;
      pcNode = {
        ...xmlToPCNode(image.toString("utf8")),
        id: node.id
      };
      break;
    }
    default: {
      console.warn(`Unsupported node type: ${node.type}`);
    }
  }

  return pcNode && cleanId(pcNode);
};

const cleanId = (node: PCNode): PCNode => ({
  ...node,
  id: node.id.replace(/:/g, "_")
});
const getFigmaNodePoint = (
  node: figma.Frame | figma.Rectangle | figma.Group | figma.Text
) => ({
  left: node.absoluteBoundingBox.x,
  top: node.absoluteBoundingBox.y
});

const convertTextStyle = (node: figma.Text, position: Point) => {
  const { fills, style: textStyle } = node;
  let style = { ...getNodeBoxStyle(node, position) };

  let color: string;

  if (fills) {
    for (const fill of fills) {
      if (fill.visible === false) continue;
      if (fill.type === "SOLID") {
        color = convertColor(fill.color);
      }
    }
  }

  style["font-family"] = textStyle.fontFamily;
  style["font-weight"] = textStyle.fontWeight;
  style["font-size"] = textStyle.fontSize;
  style["letter-spacing"] = textStyle.letterSpacing;
  style["line-height"] = px(textStyle.lineHeightPx);

  if (color) {
    style["color"] = color;
  }

  return {
    ...style,
    ...convertEffects(node)
  };
};

const convertFrameStyle = (node: figma.Frame) => {
  return {
    background: convertColor(node.backgroundColor)
  };
};

const convertRectangleStyle = (
  node: figma.Rectangle,
  design: FigmaDesign,
  position: Point
) => {
  const { fills, strokes, strokeWeight } = node;

  let style = { ...getNodeBoxStyle(node, position) };

  let backgrounds: string[] = [];
  let borders: string[] = [];
  // let backgroundBlendModes: string[]

  console.log(fills);
  if (fills) {
    for (const fill of fills) {
      if (fill.visible === false) continue;
      switch (fill.type) {
        case "SOLID": {
          backgrounds.push(convertColor(fill.color));
          break;
        }
        case "IMAGE": {
          const image = design.images[node.id];
          backgrounds.push(`url(./${getResultItemBasename(image)})`);
          break;
        }
        default: {
          console.warn(`Unsupported fill type: ${fill.type}`);
        }
      }
    }
  }

  if (strokes) {
    for (const stroke of strokes) {
      switch (stroke.type) {
        case "SOLID": {
          borders.push(`${strokeWeight} solid ${convertColor(stroke.color)}`);
          break;
        }
      }
    }
  }

  if (backgrounds.length) {
    style["background"] = backgrounds.join(", ");
  }

  if (borders.length) {
    style["border"] = borders[0];
  }

  return {
    ...style,
    ...convertEffects(node)
  };
};

const convertEffects = (node: figma.Text | figma.Rectangle | figma.Group) => {
  let style = {};
  const { effects } = node;
  const filters: string[] = [];
  if (effects) {
    for (const effect of effects) {
      switch (effect.type) {
        case "LAYER_BLUR": {
          filters.push(`blur(${px(effect.radius)})`);
          break;
        }
        case "DROP_SHADOW": {
          filters.push(
            `drop-shadow(${px(effect.offset.x)} ${px(effect.offset.y)} ${px(
              effect.radius
            )} ${convertColor(effect.color)})`
          );
          break;
        }
        default: {
          console.warn(`Unsupported effect type: ${effect.type}`);
          break;
        }
      }
    }
  }

  if (filters.length) {
    style["filter"] = filters.join(", ");
  }

  return style;
};

const getNodeBoxStyle = (
  node: figma.Group | figma.Rectangle | figma.Text,
  position: Point
) => ({
  left: px(position.left),
  top: px(position.top),
  width: px(node.absoluteBoundingBox.width),
  height: px(node.absoluteBoundingBox.height),
  "box-sizing": "border-box",
  position: "absolute"
});

const convertGroupStyle = (group: figma.Group, position: Point) => {
  let style = {};
  return {
    ...getNodeBoxStyle(group, position),
    ...convertEffects(group)
  };
};

const convertColor = ({ r, g, b, a }: figma.Color) => {
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a * 255})`;
};
