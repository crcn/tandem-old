import { Bounds } from "aerial-common2";
import { ExpressionLocation } from "paperclip";
export const AVAILABLE_COMPONENT = "AVAILABLE_COMPONENT";

export type AvailableComponent = {
  $id: string;
  tagName: string;
  label: string;
  moduleId: string;
  location: ExpressionLocation;
  screenshot: {
    uri: string;
    clip: Bounds
  },
  filePath: string;
};
