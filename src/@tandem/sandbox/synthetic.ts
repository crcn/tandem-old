import { Bundle } from "./bundle";
import { SandboxModule } from "./sandbox";
import { IExpressionInfo } from "@tandem/common";

export interface ISynthetic {
  bundle: Bundle;
  source: IExpressionInfo;
}