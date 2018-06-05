import { PCConfig } from "paperclip";

export type DesktopState = {
  projectDirectory: string;
  pcConfig?: PCConfig;
};
