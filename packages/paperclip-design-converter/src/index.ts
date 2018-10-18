import {
  ConversionOptions,
  DesignType,
  ConvertResultItem,
  getResultItemBasename
} from "./base";
import * as fsa from "fs-extra";
import * as sketch from "./sketch";
import * as figma from "./figma";
import * as path from "path";
import * as fs from "fs";

// TODO - add other design files here
type Design = sketch.SketchDesign | figma.FigmaDesign;

export const convertDesign = (design: Design, options: ConversionOptions) => {
  if (design.type === DesignType.SKETCH) {
    return sketch.convertDesign(design, options);
  } else if (design.type === DesignType.FIGMA) {
    return figma.convertDesign(design, options);
  }
};

type OpenOptions = {
  figmaToken?: string;
};

export const openDesign = (path: string, options: OpenOptions = {}) => {
  if (sketch.isSupportedPath(path)) {
    return sketch.openDesign(path);
  } else if (figma.isSupportedPath(path, options)) {
    return figma.openDesign(path, options);
  }

  throw new Error(`Unsupported type ${path}`);
};

export const writeConvertedDesignFiles = async (
  items: ConvertResultItem[],
  directory: string
) => {
  try {
    fsa.mkdirpSync(directory);
  } catch (e) {}
  const fullPaths: string[] = [];
  for (const item of items) {
    const fullPath = path.join(directory, getResultItemBasename(item));
    fs.writeFileSync(fullPath, item.content);
    fullPaths.push(fullPath);
  }
  return fullPaths;
};
