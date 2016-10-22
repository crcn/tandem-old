import { Bundle } from "./bundle";
import { SandboxModule } from "./sandbox";
import { ISourcePosition } from "@tandem/common";

let _i = 0;

export function generateSyntheticUID() {

  // TODO - add seed & platform information here
  return _i++;
}

/**
 * Information about where a synthetic object came from.
 *
 * @export
 * @interface ISyntheticSourceInfo
 */

export interface ISyntheticSourceInfo {

  /**
   * The source AST expression kind.
   *
   * @type {*}
   */

  kind: any;

  /**
   * Source file of the synthetic object expression.
   *
   * @type {string}
   */

  filePath: string;

  /**
   * Start AST expression position (necessary for edits).
   *
   * @type {ISourcePosition}
   */

  start?: ISourcePosition;

  /**
   * End position of the AST expression.
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
   * The unique ID of the synthetic object
   * @type {ISyntheticSourceInfo}
   */

  readonly uid: any;

  /**
   * Expression & file source of the synthetic object. Added at runtime by either a) an AST interpreter,
   * or b) a transpiled script that injects this property where a synthetic object is created. For example:
   *
   * const element = document.createElement("div");
   *
   * May be transpiled to:
   *
   * const element = document.createElement("div"); // SyntheticHTMLElement
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