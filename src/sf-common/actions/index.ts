import { Action } from "./base";
import { IActor } from "sf-common/actors";
import { File } from "../models";

export * from "./base";
export * from "./core";

export class SaveAction extends Action {
  static readonly SAVE_FILE = "saveFile";

  readonly path: string;
  readonly content: string;

  constructor(file: File) {
    super(SaveAction.SAVE_FILE);
    this.path = file.path;
    this.content = file.content;
  }
}

export class OpenProjectAction extends Action {
  static readonly OPEN_PROJECT_FILE = "openProjectFile";
  constructor(readonly path: string) {
    super(OpenProjectAction.OPEN_PROJECT_FILE);
  }
}

export class GetPrimaryProjectFilePathAction extends Action {
  static readonly GET_PRIMARY_PROJECT_FILE_PATH = "getPrimaryProjectFilePath";
  constructor() {
    super(GetPrimaryProjectFilePathAction.GET_PRIMARY_PROJECT_FILE_PATH);
  }
  static async execute(bus: IActor): Promise<string> {
    return (await bus.execute(new GetPrimaryProjectFilePathAction()).read()).value;
  }
}