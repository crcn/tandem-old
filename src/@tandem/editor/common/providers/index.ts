import { ClassFactoryProvider } from "@tandem/common";
import { ImportFileRequest } from "../messages";

export interface IFileImporter {
  test(filePath: string): boolean;
  importFile(request: ImportFileRequest): Promise<any>;
}

export class FileImporterProvider extends ClassFactoryProvider {
  static readonly NS = "fileImporters";
  constructor(readonly name: string, readonly importerClass: { new(): IFileImporter }) {
    super(FileImporterProvider.getId(name), importerClass);
  }
  static getId(name: string) {
    return [this.NS, name].join("/");
  }
  create(): IFileImporter {
    return super.create();
  }
  clone() {
    return new FileImporterProvider(this.name, this.importerClass);
  }
}