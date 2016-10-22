import { Bundle } from "./bundle";
import { SandboxModule } from "./sandbox";
import { ISourcePosition } from "@tandem/common";

/**
 * Information about where a synthetic object came from.
 *
 * @export
 * @interface ISyntheticSourceInfo
 */
export interface ISyntheticSourceInfo {

  /**
   * The source kind - typically an expression
   *
   * @type {*}
   */

  kind: any;

  /**
   * Source file of the synthetic object expression
   *
   * @type {string}
   */

  filePath: string;

  /**
   * Start expression position (necessary for edits)
   *
   * @type {ISourcePosition}
   */

  start?: ISourcePosition;

  /**
   * End position of the expression
   *
   * @type {ISourcePosition}
   */

  end?: ISourcePosition;
}

/**
 * Synthetic objects are created at runtime typically by an interpreter, or an emulated environment.
 *
 * @export
 * @interface ISynthetic
 */

export interface ISynthetic {

  /**
   * Expression & file source of the synthetic object. Added at runtime by either a) an AST interpreter,
   * or b) some transpiled script that injects this property whenever a synthetic object is created. For example:
   *
   * const element = document.createElement("div");
   *
   * May be transpiled to:
   *
   * const element = document.createElement("div");
   * element.$source = { kind: 'functionCall' filePath: './script.js', start: { line: 2, column: 1 }};
   */

  source?: ISyntheticSourceInfo;

  /**
   * Creates an identical copy of the synthetic object.
   *
   * @param {boolean} [deep] when omitted or FALSE, creates a shallow copy of the synthetic object. When TRUE,
   * creates a copy of the synthetic object and all of its synthetic children.
   * @returns {ISynthetic}
   */

  clone(deep?: boolean): ISynthetic;
}