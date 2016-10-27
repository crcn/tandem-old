
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
    port?: string,
    exposeSockFile: boolean
  },

  entries: any
}
