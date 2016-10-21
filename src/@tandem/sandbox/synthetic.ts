import { Bundle } from "./bundle";
import { SandboxModule } from "./sandbox";
import { ISourcePosition } from "@tandem/common";

export interface ISyntheticSourceInfo {
  kind: any;
  filePath: string;
  start?: ISourcePosition;
  end?: ISourcePosition;
}

export interface ISynthetic {
  source?: ISyntheticSourceInfo;
  editable?: boolean; // TODO
}