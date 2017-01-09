import { IEditorMasterConfig } from "@tandem/editor/master";

export interface IStudioEditorServerConfig extends IEditorMasterConfig {
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
    directory: string,
    assetUrl: string,
    indexUrl: string
  }
  cwd: string;
  experimental?: boolean,
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