import { MARKDOWN_MIME_TYPE } from "./constants";
import { MarkdownSandboxModule } from "./sandbox";
import { SandboxModuleFactoryDependency } from "@tandem/sandbox";
import { MimeTypeDependency, HTML_MIME_TYPE } from "@tandem/common";

export const markdownExtensionDependencies = [
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, MARKDOWN_MIME_TYPE, MarkdownSandboxModule),
  new MimeTypeDependency("md", MARKDOWN_MIME_TYPE)
];

