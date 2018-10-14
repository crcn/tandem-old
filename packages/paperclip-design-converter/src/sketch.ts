import { BaseDesign, DesignType, ConversionOptions } from "./base";
import { PCModule, createPCModule, PCVisibleNodeMetadataKey } from "paperclip";
import * as path from "path";
import * as fsa from "fs-extra";
import * as fs from "fs";
import * as os from "os";
import * as ns from "node-sketch";
import { appendChildNode } from "tandem-common";
import { PCNode, createPCElement } from "paperclip";
import { createPCTextNode } from "paperclip";

const EMPTY_ARRAY = [];

type Layer = {
  children: Layer[];
};

type SketchPage = {} & Layer;

export type SketchDesign = {
  document: any;
  pages: any[];
  user: any;
  meta: any;
} & BaseDesign<DesignType.SKETCH>;

export const openDesign = async (filePath: string): Promise<SketchDesign> => {
  const result = await ns.read(filePath);
  return {
    type: DesignType.SKETCH,
    pages: result.pages,
    document: result.document,
    user: null,
    meta: null
  };
};

export const isSupportedPath = (path: string) => {
  return /\.sketch$/.test(String(path));
};

export const convertDesign = async (
  design: SketchDesign,
  options: ConversionOptions
) => {
  let module = createPCModule();

  module = design.pages.reduce((module, page) => {
    return mapPage(page).reduce((page, child) => {
      return appendChildNode(child, module);
    }, module);
  }, module);

  return module;
};

const mapPage = (page: any): PCNode[] => {
  return page.layers.map(mapLayer);
};

const mapLayer = (layer: any): PCNode => {
  switch (layer._class) {
    case "text": {
      return createPCTextNode(
        layer.attributedString.string,
        layer.name,
        mapStyle(layer)
      );
    }
    case "group": {
      return createPCElement(
        `div`,
        mapStyle(layer),
        {},
        (layer.layers || EMPTY_ARRAY).map(mapLayer).filter(Boolean),
        layer.name
      );
    }
    case "rectangle": {
      return createPCElement(
        `div`,
        mapStyle(layer),
        {},
        (layer.layers || EMPTY_ARRAY).map(mapLayer).filter(Boolean),
        layer.name
      );
    }
    case "artboard": {
      return createPCElement(
        `div`,
        {},
        {},
        (layer.layers || EMPTY_ARRAY).map(mapLayer),
        layer.name,
        {
          [PCVisibleNodeMetadataKey.BOUNDS]: {
            left: layer.frame.x,
            top: layer.frame.y,
            right: layer.frame.x + layer.frame.width,
            bottom: layer.frame.y + layer.frame.height
          }
        }
      );
    }
    default: {
      // throw new Error(`Unsupported layer type: ${layer._class}`);
    }
  }
};

const mapStyle = (layer: any) => {
  const { style } = layer;
  let convertedStyle: any = {
    "box-sizing": "border-box"
  };

  if (layer.frame) {
    convertedStyle.position = "absolute";
    convertedStyle.left = layer.frame.x;
    convertedStyle.top = layer.frame.y;
    convertedStyle.width = layer.frame.width;
    convertedStyle.height = layer.frame.height;
  }

  if (!style) {
    return convertedStyle;
  }
  const { blur, shadows, borders, fills, textStyle } = style;

  if (blur) {
  }

  if (textStyle) {
    const font =
      textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes;
    const color = textStyle.encodedAttributes.MSAttributedStringColorAttribute;

    if (font) {
      convertedStyle["font-family"] = font.name;
      convertedStyle["font-size"] = `${font.size}px`;
    }
    if (color) {
      convertedStyle["color"] = mapColor(color);
    }
    convertedStyle["letter-spacing"] = textStyle.encodedAttributes.kerning;

    // console.log(textStyle.encodedAttributes);
  }

  if (shadows) {
    convertedStyle["box-shadow"] = shadows
      .map(({ offsetX, offsetY, blurRadius, spread, color }) => {
        return `${offsetX}px ${offsetY}px ${blurRadius}px ${spread}px ${mapColor(
          color
        )}`;
      })
      .join(",");
  }

  if (borders) {
    // todo - possibly use box shadows here instead
    for (const { color, thickness } of borders) {
      convertedStyle.border = `${thickness}px solid ${mapColor(color)}`;
    }
  }

  if (fills) {
    for (const { color, gradient, fillType } of fills) {
      // solid
      if (fillType === 0) {
        convertedStyle["background"] = mapColor(color);

        // gradient
      } else if (fillType === 1) {
      }
      if (color) {
        // console.log("COL");
      }
      if (gradient) {
        // convertedStyle["background-image"] = `linear-gradient(${})`;
      }
      // console.log(gradient);
    }
    // console.log(fills);
    // console.log(fills);
  }

  return convertedStyle;
};

const mapColor = ({ red, blue, green, alpha }) =>
  `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(
    blue * 255
  )}, ${alpha.toFixed(2)})`;
