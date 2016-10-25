
/**
 * Manages visual editor and possibly workers
 *
 * @export
 * @interface IEdtorServerConfig
 */

export interface IEdtorServerConfig {
  port?: number;
  cwd: string;
  argv: {
    _: any[]
  }
}
