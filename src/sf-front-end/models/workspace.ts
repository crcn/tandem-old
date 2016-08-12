import { File } from "./file";
import { Editor } from "./editor";

export class Workspace {

  /**
   * The active file in this workspace
   * @type {File}
   */

  file: File;

  /**
   * The editors of the file
   */

  editors: Array<Editor>;
}