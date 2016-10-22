import { MARKDOWN_MIME_TYPE } from "./constants";
import { MarkdownSandboxModule, MarkdownBundleLoader } from "./sandbox";

import { BundlerLoaderFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, HTML_MIME_TYPE } from "@tandem/common";

export const markdownExtensionDependencies = [
  new BundlerLoaderFactoryDependency(MARKDOWN_MIME_TYPE, MarkdownBundleLoader),
  new MimeTypeDependency("md", MARKDOWN_MIME_TYPE)
];

