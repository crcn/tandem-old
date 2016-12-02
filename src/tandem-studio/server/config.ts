import { IEdtorServerConfig } from "@tandem/editor/server/config";

export interface IStudioEditorServerConfig extends  IEdtorServerConfig {
  projectFileExtensions: string[],
  browser: {
    assetUrl: string,
    indexUrl: string
  }
}