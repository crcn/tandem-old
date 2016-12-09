import { inject } from "@tandem/common";
import { IDependencyGraphStrategyOptions } from "@tandem/sandbox";

export interface ISavePreviewOptions {
  uri: string;
}

export interface IModulePreview {
  uri: string;
}

export interface IProjectConfigFileHandlerOptions {
  test: RegExp|((uri: string) => boolean);
  dependencyGraph: { strategy: IDependencyGraphStrategyOptions };
  createPreview(options: { uri: string }): { uri: string, content: string };
}

export interface IProjectConfigOptions {
  fileHandlers?: IProjectConfigFileHandlerOptions[];
}

export interface IModulePreview {
  content: string;
  uri: string;
}

export class ProjectFileHandler implements IProjectConfigFileHandlerOptions {
  readonly test: (filePath: string) =>  boolean;
  readonly dependencyGraph: { strategy: IDependencyGraphStrategyOptions };
  readonly createPreview: (options: { uri: string }) => { uri: string, content: string };

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