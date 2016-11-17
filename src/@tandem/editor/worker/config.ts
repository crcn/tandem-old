import {IEditorCommonConfig } from "../common";
export interface IEditorWorkerConfig extends IEditorCommonConfig {
  hostname: string;
  port: number;
}