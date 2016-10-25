import { Dependencies } from "@tandem/common";
import { concatCoreApplicationDependencies } from "../core";
import { IEdtorServerConfig } from "./config";

export function concatEditorServerDependencies(dependencies: Dependencies, config: IEdtorServerConfig) {
  return new Dependencies(
    concatCoreApplicationDependencies(dependencies, config)
  )
}


export * from "./config";
export * from "./services";