export * from "./scss-loader";
import * as postcssSassSyntax from "postcss-scss";

import { SCSSEditor } from "./scss-editor";
import { SCSSLoader } from "./scss-loader";
import { SASS_MIME_TYPE } from "../constants";
import { MimeTypeProvider, JS_MIME_TYPE, CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";
import { DependencyLoaderFactoryProvider, ContentEditorFactoryProvider } from "@tandem/sandbox";

export const createSASSSandboxProviders = () => {
  return [
    new DependencyLoaderFactoryProvider(SASS_MIME_TYPE, SCSSLoader),
    new ContentEditorFactoryProvider(SASS_MIME_TYPE, SCSSEditor),
    new MimeTypeProvider("scss", SASS_MIME_TYPE)
  ];
}
