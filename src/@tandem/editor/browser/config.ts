import { LogLevel } from "@tandem/common";
import { IEditorCommonConfig } from "../common";

/**
 * visual editor
 *
 * @export
 * @interface IEditorBrowserConfig
 */


// TODO - possibly extend IWorkerConfig since the browser is technically
// a worker of the server 

export interface IEditorBrowserConfig extends IEditorCommonConfig {

  useDefaultKeyBindings?: boolean;

  /**
   * The mounting point into the application
   */

  element: HTMLElement;

  // /**
  //  * The configuration for the master server
  //  */

  // server: {
  //   cwd: string;
  //   port?: number;
  //   hostname: string;
  //   protocol: string;
  //   href?: string;
  // },
}