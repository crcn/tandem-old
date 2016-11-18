import { IEditorCommonConfig } from "../common";

/**
 * Manages visual editor and possibly workers
 *
 * @export
 * @interface IEdtorServerConfig
 */

export interface IEdtorServerConfig extends IEditorCommonConfig {
  cwd: string;
  experimental?: boolean,
  port: number,
  hostname: string,
  argv: {
    _: any[],
    open?: boolean,
    hlog?: string,
    exposeSockFile?: boolean
  },
  entries?: any;
}
