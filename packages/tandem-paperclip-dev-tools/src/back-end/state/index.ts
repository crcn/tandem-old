import * as md5 from "md5";

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


// export const createComponentFromFilePath = (filePath: string): Component => ({
//   // $id: md5(filePath)
// })