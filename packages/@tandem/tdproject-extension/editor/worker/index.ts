import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { MimeTypeProvider, MimeTypeAliasProvider } from "@tandem/common";
import { TDRootFileImporter } from "./importers";
import { FileImporterProvider } from "@tandem/editor/worker";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider, SyntheticDOMElement } from "@tandem/synthetic-browser";

export const createTDProjectEditorWorkerProviders = () => {
  return [
    ...createTDProjectCoreProviders(),
    new FileImporterProvider("tdproject", (request) => request.targetObject && (<SyntheticDOMElement>request.targetObject).nodeName === "tandem", TDRootFileImporter)
  ];
}

export * from "../../core";