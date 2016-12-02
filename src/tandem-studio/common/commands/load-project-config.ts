import * as path from "path";
import * as assert from "assert";
import { PROJECT_CONFIG_FILE_NAME } from "../constants";
import { ProjectConfig, ProjectFileHandler } from "tandem-studio/common/stores";
import { inject, ICommand, loggable, Logger, InjectorProvider, Injector } from "@tandem/common";
import { PreviewLoaderProvider, IFileImporter, ImportFileRequest, IFilePreviewLoader, IPreviewLoaderResult } from "@tandem/editor/worker";
import { FileSystemProvider, FileResolverProvider, IFileSystem, IFileResolver, IDependencyLoader, DependencyGraphStrategyOptionsProvider } from "@tandem/sandbox";

/**
 * Loads the project config into the application in the form of extensions
 */

@loggable()
export class LoadProjectConfigCommand implements ICommand {

  protected logger: Logger;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  @inject(FileResolverProvider.ID)
  private _fileResolver: IFileResolver;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async execute() {
    const configPath = path.join(process.cwd(),  PROJECT_CONFIG_FILE_NAME);
    this.logger.info(`Loading project config ${configPath}`);

    const { fileHandlers } = new ProjectConfig(require(configPath));

    this._injector.register(
      fileHandlers.map((handler, i) => {
        return [
          new PreviewLoaderProvider("projectPreviewLoader" + i, handler.test.bind(handler), createProjectPreviewLoader(handler)),
          new DependencyGraphStrategyOptionsProvider("graphStrategyOptions" + i, handler.test.bind(handler), handler.dependencyGraph.strategy)
        ];
      })
    );
  }
}

const createProjectPreviewLoader = (fileHandler: ProjectFileHandler) => {
  return class ProjectPreviewLoader implements IFilePreviewLoader {
    async loadFilePreview(request: ImportFileRequest) {
      const ret = fileHandler.createPreview({
        filePath: request.filePath.replace(/file:\/\//, "")
      }) as IPreviewLoaderResult;
      return ret;
    }
  }
}