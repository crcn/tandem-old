import { TDArtboardStageToolComponent } from "./components";
import { ReactComponentFactoryDependency } from "@tandem/editor/browser";

export function createTDProjectEditorBrowserDependencies() {
  return [
    // stage tool components
    new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),
  ]
}

export * from "../../core";