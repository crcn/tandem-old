import * as md5 from "md5";
import { IResolvedDependencyInfo } from "./strategies";

export function getDependencyHash(strategyName: string, { filePath, loaderOptions }: IResolvedDependencyInfo): string {
  return md5(strategyName + ":" + filePath + ":" + JSON.stringify(loaderOptions || {}));
}