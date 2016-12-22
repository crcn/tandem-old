import { IEditorCommonConfig } from "@tandem/editor/common";

export interface IStudioWorkerConfig extends IEditorCommonConfig {
  family: string,
  cwd: string,
  experimental: boolean,
}