import { FileCache } from "./file-cache";
import { ENV_IS_NODE, IProvider } from "@tandem/common";
import { FileEditor, contentEditorType, IEditor } from "./edit";
import { IFileSystem, LocalFileSystem, RemoteFileSystem } from "./file-system";
import { IFileResolver, LocalFileResolver, RemoteFileResolver } from "./resolver";

import {
  Provider,
  Injector,
  FactoryProvider,
  MimeTypeProvider,
  ClassFactoryProvider,
  createSingletonProviderClass,
} from "@tandem/common";


export class ContentEditorFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "contentEditors";
  constructor(readonly mimeType: string, clazz: contentEditorType) {
    super(ContentEditorFactoryProvider.getNamespace(mimeType), clazz);
  }

  static getNamespace(mimeType: string) {
    return [ContentEditorFactoryProvider.NS, mimeType].join("/");
  }

  create(filePath: string, content: string): IEditor {
    return super.create(filePath, content);
  }

  static find(mimeType: string, injector: Injector) {
    return injector.query<ContentEditorFactoryProvider>(this.getNamespace(mimeType));
  }
}

export const FileSystemProvider  = createSingletonProviderClass<IFileSystem>("fileSystem");
export const FileResolverProvider  = createSingletonProviderClass<IFileResolver>("fileResolver");
export const FileCacheProvider  = createSingletonProviderClass<FileCache>("fileCache");
export const FileEditorProvider = createSingletonProviderClass<FileEditor>("fileEditor");

// TODO - this needs to be a singleton based on a given strategy (webpack, systemjs, rollup)
// export const DependencyGraphProvider    = createSingletonProviderClass<DependencyGraph>("bundler");