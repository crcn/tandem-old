import {
  inject,
  Logger,
  CoreEvent,
  ICommand,
  loggable,
} from "@tandem/common";

import { Kernel, KernelProvider } from "@tandem/common"
import { ImportFileRequest, FileImporterProvider, IFileImporter } from "@tandem/editor/worker";

@loggable()
export class ImportFileCommand implements ICommand {
  protected logger: Logger;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  async execute(request: ImportFileRequest) {

    this.logger.info(`Importing ${request.uri}`);

    const importerProvider = FileImporterProvider.findByDropTarget(request, this._kernel);

    if (!importerProvider) {
      throw new Error(`File type supported.`);
    }

    const importer = importerProvider.create();
    await importer.importFile(request);
  }
}