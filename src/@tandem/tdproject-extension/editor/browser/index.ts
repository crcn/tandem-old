import { TDArtboardStageToolComponent } from "./components";
import { ReactComponentFactoryDependency } from "@tandem/editor/browser";

import { createTDProjectCoreDependencies } from "../../core";

export function createTDProjectEditorBrowserDependencies() {
  return [
    ...createTDProjectCoreDependencies(),
    new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),
  ]
}

export * from "../../core";