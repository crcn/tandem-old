import {
  inject,
  Logger,
  Action,
  ICommand,
  loggable,
} from "@tandem/common";

import { Injector, InjectorProvider } from "@tandem/common"
import { FileSystemProvider, IFileSystem } from "@tandem/sandbox";
import { ImportFileRequest, FileImporterProvider, IFileImporter } from "@tandem/editor/worker";

@loggable()
export class ImportFileCommand implements ICommand {
  protected logger: Logger;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async execute(request: ImportFileRequest) {

    const importerProvider = FileImporterProvider.findByDropTarget(request.targetObject, this._injector);

    if (!importerProvider) {
      throw new Error(`File type supported.`);
    }

    const importer = importerProvider.create();
    await importer.importFile(request);
  }
}