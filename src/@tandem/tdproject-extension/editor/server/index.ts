import { ContentEditorFactoryDependency } from "@tandem/sandbox";
import { createTDProjectCoreDependencies } from "../../core";
import { MimeTypeDependency, MimeTypeAliasDependency } from "@tandem/common";
import { MarkupMimeTypeXMLNSDependency, SyntheticDOMElementClassDependency } from "@tandem/synthetic-browser";

export const createTDProjectEditorServerDependencies = () => {
  return [
    ...createTDProjectCoreDependencies()
  ];
}

export * from "../../core";