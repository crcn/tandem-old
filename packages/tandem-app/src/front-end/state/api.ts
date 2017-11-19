import { Bounds } from "aerial-common2";
export const AVAILABLE_COMPONENT = "AVAILABLE_COMPONENT";

export type AvalaibleComponent = {
  tagName: string;
  label: string;
  moduleId: string;
  screenshot: {
    uri: string;
    clip: Bounds
  },
  filePath: string;
};
