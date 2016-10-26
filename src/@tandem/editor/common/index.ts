import { ApplicationServiceDependency } from "@tandem/core";
import { ConsoleLogService } from "./services";

export const createCommonEditorDependencies = () => {
  return [
    new ApplicationServiceDependency("console", ConsoleLogService)
  ];
}

export * from "./services";