import { inject } from "@tandem/common";
import { IFileSystem, IDependencyGraphStrategyOptions } from "@tandem/sandbox";

export interface ISavePreviewOptions {
  filePath: string;
}

export interface IModulePreview {
  filePath: string;
}

export interface IProjectConfigFileHandlerOptions {
  test: RegExp|((filePath: string) => boolean);
  dependencyGraph: { strategy: IDependencyGraphStrategyOptions };
  createPreview(options: { filePath: string }): { filePath: string, content: string };
}

export interface IProjectConfigOptions {
  fileHandlers?: IProjectConfigFileHandlerOptions[];
}

export interface IModulePreview {
  content: string;
  filePath: string;
}

export class ProjectFileHandler implements IProjectConfigFileHandlerOptions {
  readonly test: (filePath: string) =>  boolean;
  readonly dependencyGraph: { strategy: IDependencyGraphStrategyOptions };
  readonly createPreview: (options: { filePath: string }) => { filePath: string, content: string };

  constructor({ test, createPreview, dependencyGraph }: IProjectConfigFileHandlerOptions) {
    if (test instanceof RegExp) {
      this.test = filePath => test.test(filePath);
    } else {
      this.test = test;
    }
    this.createPreview = createPreview;
    this.dependencyGraph = dependencyGraph;
  }
}

export class ProjectConfig {

  readonly fileHandlers: ProjectFileHandler[];

  constructor({ fileHandlers }: IProjectConfigOptions) {
    this.fileHandlers = (fileHandlers || []).map(options => new ProjectFileHandler(options));
  }
}