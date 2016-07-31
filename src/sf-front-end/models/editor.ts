import { IFile } from "./base";

export class Editor {

  /**
   */

  public zoom: number = 1;

  /**
   * The currently selected items in the preview
   */

  public selection: Array<any> = [];

  /**
   * The current tool
   */

  public currentTool: any = {
    name: "pointer",
    cursor: "pointer"
  };

  /**
   */

  public tools: Array<any> = [];

  /**
   */

  public file: IFile;
}