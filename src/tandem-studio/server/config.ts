import { IEdtorServerConfig } from "@tandem/editor/server/config";

export interface IStudioEditorServerConfig extends  IEdtorServerConfig {
  browser: {
    assetUrl: string,
    indexUrl: string
  }
}