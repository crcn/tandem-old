import { MARKDOWN_MIME_TYPE } from "./constants";
import { MarkdownSandboxModule, MarkdownBundleTransformer } from "./sandbox";

import { SandboxModuleFactoryDependency, BundleTransformerFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, HTML_MIME_TYPE } from "@tandem/common";

export const markdownExtensionDependencies = [
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, MARKDOWN_MIME_TYPE, MarkdownSandboxModule),
  new BundleTransformerFactoryDependency(MARKDOWN_MIME_TYPE, MarkdownBundleTransformer),
  new MimeTypeDependency("md", MARKDOWN_MIME_TYPE)
];

