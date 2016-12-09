import {
  inject,
  Logger,
  CoreEvent,
  ICommand,
  loggable,
} from "@tandem/common";

import { Injector, InjectorProvider } from "@tandem/common"
import { ImportFileRequest, FileImporterProvider, IFileImporter } from "@tandem/editor/worker";

@loggable()
export class ImportFileCommand implements ICommand {
  protected logger: Logger;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async execute(request: ImportFileRequest) {

    this.logger.info(`Importing ${request.uri}`);

    const importerProvider = FileImporterProvider.findByDropTarget(request, this._injector);

    if (!importerProvider) {
      throw new Error(`File type supported.`);
    }

    const importer = importerProvider.create();
    await importer.importFile(request);
  }
}