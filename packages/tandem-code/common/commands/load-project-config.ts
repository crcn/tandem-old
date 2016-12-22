import path =  require("path");
import fs = require("fs");
import assert = require("assert");
import { PROJECT_CONFIG_FILE_NAME } from "../constants";
import { ProjectConfig, ProjectFileHandler } from "tandem-code/common/stores";
import { inject, ICommand, loggable, Logger, KernelProvider, Kernel } from "@tandem/common";
import { IFileResolver, IDependencyLoader, DependencyGraphStrategyOptionsProvider } from "@tandem/sandbox";
import { PreviewLoaderProvider, IFileImporter, ImportFileRequest, IFilePreviewLoader, IPreviewLoaderResult } from "@tandem/editor/worker";

/**
 * Loads the project config into the application in the form of extensions
 */


@loggable()
export class LoadProjectConfigCommand implements ICommand {

  protected logger: Logger;


  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  execute() {
    const configPath = path.join(process.cwd(),  PROJECT_CONFIG_FILE_NAME);
    this.logger.info(`Loading project config ${configPath}`);

    if (!fs.existsSync(configPath) || 1 + 1) return;
    

    const { fileHandlers } = new ProjectConfig(require(configPath));

    this._kernel.register(
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
        uri: request.uri,
      }) as IPreviewLoaderResult;
      return ret;
    }
  }
}