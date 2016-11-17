import { inject } from "@tandem/common";
import { IFileSystem } from "@tandem/sandbox";

export interface IProjectConfigPreviewOptions {
  template: (context: any) => string;
}

export interface IProjectConfigFileHandlerOptions {

  test: RegExp|((filePath: string) => boolean);
  preview?: IProjectConfigPreviewOptions;
}

export interface IProjectConfigOptions {
  fileHandlers?: IProjectConfigFileHandlerOptions[];
}

export class ProjectFileHandler {
  readonly test: (filePath: string) =>  boolean;
  constructor({ test, preview }: IProjectConfigFileHandlerOptions) {
    if (test instanceof RegExp) {
      this.test = filePath => test.test(filePath);
    } else {
      this.test = test;
    }
  }
}

export class ProjectConfig {

  readonly fileHandlers: ProjectFileHandler[];

  constructor({ fileHandlers }: IProjectConfigOptions) {
    this.fileHandlers = (fileHandlers || []).map(options => new ProjectFileHandler(options));
  }
}