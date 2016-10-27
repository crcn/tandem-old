import { TDArtboardStageToolComponent } from "./components";
import { ContentEditorFactoryDependency } from "@tandem/sandbox";
import { ReactComponentFactoryDependency } from "@tandem/editor/browser";
import { createTDProjectCoreDependencies } from "../../core";
import { MimeTypeAliasDependency, MimeTypeDependency } from "@tandem/common";
import { MarkupMimeTypeXMLNSDependency, SyntheticDOMElementClassDependency } from "@tandem/synthetic-browser";


export function createTDProjectEditorBrowserDependencies() {
  return [
    ...createTDProjectCoreDependencies(),
    new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),
  ]
}

export * from "../../core";