import { Action } from "./base";
import { File } from "../models";

export * from "./base";
export * from "./core";

export const SAVE_FILE = "saveFile";
export class SaveAction extends Action {
  readonly path: string;
  readonly content: string;

  constructor(file: File) {
    super(SAVE_FILE);
    this.path = file.path;
    this.content = file.content;
  }
}

export const OPEN_PROJECT = "openProject";
export class OpenProjectAction extends Action {
  readonly path: string;
  readonly content: string;

  constructor(file: File) {
    super(OPEN_PROJECT);
    this.path = file.path;
    this.content = file.content;
  }
}