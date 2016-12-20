import { IEditorCommonConfig } from "@tandem/editor/common";

export interface IEditorMasterConfig extends IEditorCommonConfig {
  // http: {
  //   port: number,
  //   hostname: string
  // },
  worker: {
    mainPath: string,
    env: any
  }
}