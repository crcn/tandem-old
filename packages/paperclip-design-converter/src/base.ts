import * as fs from "fs";

export enum DesignType {
  SKETCH
}

export type BaseDesign<TType extends DesignType> = {
  type: TType;
};

export type ConversionOptions = {
  symbols: boolean;
  colors: boolean;
  styleMixins: boolean;
  exports: boolean;
};
