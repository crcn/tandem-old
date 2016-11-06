import { LogLevel } from "@tandem/common";

/**
 * Manages visual editor and possibly workers
 *
 * @export
 * @interface IEdtorServerConfig
 */

export interface IEdtorServerConfig {
  cwd: string;
  logLevel?: LogLevel,
  experimental: boolean,
  argv: {
    _: any[],
    open?: boolean,
    hlog: string,
    port?: string,
    exposeSockFile: boolean
  },

  entries: any
}
