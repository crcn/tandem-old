
/**
 * Manages visual editor and possibly workers
 *
 * @export
 * @interface IEdtorServerConfig
 */

export interface IEdtorServerConfig {
  cwd: string;

  argv: {
    _: any[],
    open?: boolean,
    hlog: string,
    port?: string,
    exposeSockFile: boolean
  },

  entries: any
}
