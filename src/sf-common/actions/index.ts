import { Action } from "sf-core/actions";
import { File } from "../models";

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