import { ModuleFactoryDependency, EnvironmentKind } from "@tandem/runtime";
import { TSJSModule } from "@tandem/typescript-extension";
import { MimeType } from "../constants";

export const jsModuleFactoryDependency = new ModuleFactoryDependency(EnvironmentKind.JavaScript, MimeType.JS, TSJSModule);