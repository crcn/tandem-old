import {
  inject,
  Logger,
  Action,
  ICommand,
  loggable,
} from "@tandem/common";

import { ImportFileRequest, FileImporterProvider, IFileImporter } from "@tandem/editor/common";

@loggable()
export class ImportFileCommand implements ICommand {
  protected logger: Logger;

  @inject(FileImporterProvider.getId("**"), (provider: FileImporterProvider) => provider.create())
  private _importers: IFileImporter[];

  async execute({ filePath, options }: ImportFileRequest) {
    this.logger.info(`Adding new file ${filePath}`);

    const importer = this._importers.find((importer) => importer.test(filePath));
    console.log(importer);
    if (!importer) {
      throw new Error(`Unable to import ${filePath}`);
    }

    return await importer.importFile(arguments[0]);
  }
}