import { Editor } from "./editor";
import { Workspace } from "./workspace";

/**
 * The root model which holds all open files
 */

export class Workspaces {
  workspace: Array<Workspace>;

  /**
   * The editor which is currently in focus
   */

  activeEditor: Editor;
}
