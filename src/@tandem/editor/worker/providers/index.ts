import { ISyntheticObject } from "@tandem/sandbox";
import { ImportFileRequest } from "@tandem/editor/common/messages";
import { IDependencyLoader } from "@tandem/sandbox";
import { ClassFactoryProvider, Injector } from "@tandem/common";

export interface IFileImporter {
  importFile(request: ImportFileRequest): Promise<any>;
}

export class FileImporterProvider extends ClassFactoryProvider {
  static readonly NS = "fileImporters";
  constructor(readonly name: string, readonly test: (request: ImportFileRequest) => boolean, readonly importerClass: { new(): IFileImporter }) {
    super(FileImporterProvider.getId(name), importerClass);
  }
  static getId(name: string) {
    return [this.NS, name].join("/");
  }
  create(): IFileImporter {
    return super.create();
  }
  clone() {
    return new FileImporterProvider(this.name, this.test, this.importerClass);
  }

  static findByDropTarget(request: ImportFileRequest, injector: Injector) {
    const importers = injector.queryAll<FileImporterProvider>(this.getId("**"));
    const importer = importers.find(importer => importer.test(request));
    return importer;
  }
}

export interface IPreviewLoaderResult {
  filePath: string;
  content: string;
}

export interface IFilePreviewLoader {
  loadFilePreview(request: ImportFileRequest): Promise<IPreviewLoaderResult>;
}

export class PreviewLoaderProvider extends ClassFactoryProvider {
  static readonly NS = "filePreviewLoaders";

  constructor(readonly name: string, readonly test: (filePath: string) => boolean, readonly loaderClass: { new(): IFilePreviewLoader }) {
    super(PreviewLoaderProvider.getId(name), loaderClass);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  create(): IFilePreviewLoader {
    return super.create();
  }

  clone() {
    return new PreviewLoaderProvider(this.name, this.test, this.loaderClass);
  }

  static find(filePath: string, injector: Injector) {
    const providers = injector.queryAll<PreviewLoaderProvider>(this.getId("**"));
    const provider = providers.find(provider => provider.test(filePath));
    return provider && provider.create();
  }
}