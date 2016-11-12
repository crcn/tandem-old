import { ConsoleLogService } from "./services";
import { ApplicationServiceProvider } from "@tandem/core";

export const createCommonEditorProviders = () => {
  return [
    new ApplicationServiceProvider("console", ConsoleLogService)
  ];
}

export * from "./services";
export * from "./actions";
export * from "./models";