import { ApplicationServiceProvider } from "@tandem/core";
import { ConsoleLogService } from "./services";

export const createCommonEditorDependencies = () => {
  return [
    new ApplicationServiceProvider("console", ConsoleLogService)
  ];
}

export * from "./services";
export * from "./actions";