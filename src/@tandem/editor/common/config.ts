import { LogLevel } from "@tandem/common"

export interface ILogConfig {
  level?: LogLevel;
  prefix?: string;
}

export interface IEditorCommonConfig {
  family: string;
  log?: ILogConfig;
}