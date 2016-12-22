import { MimeTypeProvider } from "@tandem/common";
import { MARKDOWN_MIME_TYPE } from "./constants";
import { MarkdownDependencyLoader } from "./sandbox";
import { DependencyLoaderFactoryProvider } from "@tandem/sandbox";
import { FileImporterProvider, PreviewLoaderProvider, SelfPreviewLoader } from "@tandem/editor/worker";

export const createCoreMarkdownExtensionProviders = () => {
  return [
    new MimeTypeProvider("md", MARKDOWN_MIME_TYPE),
    new DependencyLoaderFactoryProvider(MARKDOWN_MIME_TYPE, MarkdownDependencyLoader),
    new PreviewLoaderProvider("markdown", (uri, kernel) => {
      return MimeTypeProvider.lookup(uri, kernel) === MARKDOWN_MIME_TYPE;
    }, SelfPreviewLoader)
  ]
}
