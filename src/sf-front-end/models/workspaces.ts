import { Workspace } from "./workspace";
import { Editor } from "./editor";

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
