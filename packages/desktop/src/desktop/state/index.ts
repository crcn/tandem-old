import { PCConfig } from "paperclip";

export type TDProject = {
  scripts: {
    previewServer: string;
  };
} & PCConfig;

type PreviewServerInfo = {
  port: number;
};

export type DesktopState = {
  tdProjectPath?: string;
  tdProject?: TDProject;
  info: {
    previewServer?: PreviewServerInfo;
  };
};
