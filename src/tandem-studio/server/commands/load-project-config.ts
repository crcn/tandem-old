import * as path from "path";
import { ServerStoreProvider } from "../providers";
import { PROJECT_CONFIG_FILE_NAME } from "../constants";
import { FileSystemProvider, IFileSystem } from "@tandem/sandbox";
import { Store, ProjectConfig, ProjectFileHandler } from "../models";
import { FileImporterProvider, IFileImporter, ImportFileRequest } from "@tandem/editor/common";
import { inject, ICommand, loggable, Logger, InjectorProvider, Injector } from "@tandem/common";

/**
 * Loads the project config into the application in the form of extensions
 */

@loggable()
export class LoadProjectConfigCommand implements ICommand {

  protected logger: Logger;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  @inject( ServerStoreProvider.ID)
  private _store: Store;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async execute() {
    const configPath = path.join(process.cwd(),  PROJECT_CONFIG_FILE_NAME);
    this.logger.info(`Loading project config ${configPath}`);

    const { fileHandlers } = new ProjectConfig(require(configPath));

    this._injector.register(
      fileHandlers.map((handler, i) => {
        return new FileImporterProvider("projectFileImporter" + i, createProjectFileImporter(handler))
      })
    );
  }
}

const createProjectFileImporter = (fileHandler: ProjectFileHandler) => {
  return class ProjectFileImporter implements IFileImporter {
    test(filePath: string) {
      return fileHandler.test(filePath);
    }
    async importFile(request: ImportFileRequest) {
      console.log("IMPORT LE FILE!");
    }
  }
}