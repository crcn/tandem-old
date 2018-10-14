import * as fs from "fs";
import { ConversionOptions } from "./base";
import * as sketch from "./sketch";

export enum DesignType {
  SKETCH
}

export type BaseDesign<TType extends DesignType> = {
  type: TType;
};

// TODO - add other design files here
type Design = sketch.SketchDesign;

export const convertDesign = (design: Design, options: ConversionOptions) => {
  if (design.type === DesignType.SKETCH) {
    return sketch.convertDesign(design, options);
  } else {
    return null;
  }
};

export const openDesign = (path: string) => {
  if (sketch.isSupportedPath(path)) {
    return sketch.openDesign(path);
  }

  throw new Error(`Unsupported type ${path}`);
};
