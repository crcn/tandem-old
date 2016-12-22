import { IEditorMasterConfig } from "@tandem/editor/master/config";

export interface IPlaygroundServerConfig extends IEditorMasterConfig {
  family: string;
  browserDirectory: string;
  mongoUrl: string;
}