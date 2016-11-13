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
