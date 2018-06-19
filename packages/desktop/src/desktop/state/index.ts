import { PCConfig } from "paperclip";

export type TDConfig = {
  scripts: {
    previewServer: string;
  };
};

type PreviewServerInfo = {
  port: number;
};

export type DesktopState = {
  projectDirectory?: string;
  pcConfig?: PCConfig;
  tdConfig?: TDConfig;
  info: {
    previewServer?: PreviewServerInfo;
  };
};
