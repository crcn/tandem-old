import { IEditorCommonConfig } from "@tandem/editor/common";

export interface IStudioEditorServerConfig extends IEditorCommonConfig {
  projectFileExtensions: string[],
  appDirectory: string,
  settingsDirectory: string, // ~/.tandem
  cacheDirectory: string, // ~/.tandem
  tmpDirectory: string, // ~/.tandem
  updateFeedHost: string,
  help: {
    directory: string,
  },
  browser: {
    assetUrl: string,
    indexUrl: string
  }
  cwd: string;
  experimental?: boolean,
  port: number,
  hostname: string,
  argv: {
    _: any[],

    // allow require() statements in code
    commonjs: boolean,
    executedFrom?: string,
    open?: boolean,
    hlog?: string,
    exposeSockFile?: boolean
  },
  entries?: any;
}