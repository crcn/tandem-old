import {  TSEditor } from "@tandem/typescript-extension/sandbox";
import { TS_MIME_TYPE } from "@tandem/typescript-extension/constants";
import { MimeTypeProvider } from "@tandem/common";
import { ContentEditorFactoryProvider } from "@tandem/sandbox";

export const createTypescriptEditorWorkerProviders = () => {
  return [
    new MimeTypeProvider("ts", TS_MIME_TYPE),
    new MimeTypeProvider("tsx", TS_MIME_TYPE),
    new ContentEditorFactoryProvider(TS_MIME_TYPE, TSEditor)
  ];
}