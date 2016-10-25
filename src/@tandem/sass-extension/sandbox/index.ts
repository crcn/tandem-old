export * from "./scss-loader";

import { CSSEditor } from "@tandem/synthetic-browser";
import { SCSSLoader } from "./scss-loader";
import { SASS_MIME_TYPE } from "../constants";
import { MimeTypeDependency, JS_MIME_TYPE, CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";
import { BundlerLoaderFactoryDependency, ContentEditorFactoryDependency } from "@tandem/sandbox";

export const createSASSSandboxDependencies = () => {
  return [
    new BundlerLoaderFactoryDependency(SASS_MIME_TYPE, SCSSLoader),
    new ContentEditorFactoryDependency(SASS_MIME_TYPE, CSSEditor),
    new MimeTypeDependency("scss", SASS_MIME_TYPE)
  ];
}
