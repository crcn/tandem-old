import { FileImporterProvider } from "@tandem/editor/worker";
import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { createTDProjectCoreProviders } from "../../core";
import { createTDProjectEditorWorkerProviders } from "../worker";
import { MimeTypeProvider, MimeTypeAliasProvider } from "@tandem/common";
import { MarkupMimeTypeXMLNSProvider, SyntheticDOMElementClassProvider } from "@tandem/synthetic-browser";

export const createTDProjectEditorServerProviders = createTDProjectEditorWorkerProviders;

export * from "../../core";
export * from "../worker";