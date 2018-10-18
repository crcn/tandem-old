import * as fs from "fs";
import { kebabCase } from "lodash";
import { PCModule } from "paperclip/src";

export enum DesignType {
  SKETCH,
  FIGMA
}

export type BaseDesign<TType extends DesignType> = {
  type: TType;
};

export type ConversionOptions = {
  mainPageFileName?: string;
  symbols: boolean;
  colors: boolean;
  styleMixins: boolean;
  exports: boolean;
};

export type ConvertResultItem = {
  name: string;
  extension: string;
  content: Buffer;
};

export type ConvertResult = ConvertResultItem[];

export const getResultItemBasename = ({ name, extension }: ConvertResultItem) =>
  kebabCase(name) + "." + extension;
