import * as md5 from "md5";
import * as fs from "fs";
import { getPCMetaName, parse } from "../../paperclip";

export type Config = {
  componentsDirectory?: string;
};

export type ApplicationState = {
  cwd: string;
  port: number;
  config: Config;
};

export type Component = {
  label: string;
  $id: string;
}


export const createComponentFromFilePath = (content: string, filePath: string): Component => ({
  $id: md5(filePath),
  label: getPCMetaName(parse(content))
});