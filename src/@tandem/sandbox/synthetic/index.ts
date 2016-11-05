import { Dependency } from "../dependency-graph";
import { SandboxModule } from "../sandbox";
import { ISourcePosition, ISerializer, IWalkable, sourcePositionEquals } from "@tandem/common";

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

export function syntheticSourceInfoEquals(a: ISyntheticSourceInfo, b: ISyntheticSourceInfo) {
  return (a == null && b == null) || (a && b && a.kind === b.kind && a.filePath === b.filePath && sourcePositionEquals(a.start, b.start) && sourcePositionEquals(a.end, b.end));
}

/**
 * Synthetic objects are created at runtime typically by an interpreter, or an emulated environment.
 *
 * @export
 * @interface ISynthetic
 */

export interface ISyntheticObject extends IWalkable {

  /**
   * Internal property. See below for docs
   */

  $source?: ISyntheticSourceInfo;

  /**
   * Internal
   */

  $uid: any;

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

  readonly source?: ISyntheticSourceInfo;

  /**
   * Creates an identical copy of the synthetic object.
   *
   * @param {boolean} [deep] when omitted or FALSE, creates a shallow copy of the synthetic object. When TRUE,
   * creates a copy of the synthetic object and all of its synthetic children.
   * @returns {ISynthetic}
   */

  clone(deep?: boolean): ISyntheticObject;
}

export interface ISerializedSyntheticObject {
  source: ISyntheticSourceInfo;
  uid: any;
}

/**
 * Converts the synthetic object into a format that can be transfered over a network.
 */

export class SyntheticObjectSerializer implements ISerializer<ISyntheticObject, ISerializedSyntheticObject> {
  constructor(readonly childSerializer: ISerializer<ISyntheticObject, any>) { }
  serialize(value: ISyntheticObject) {
    return Object.assign(this.childSerializer.serialize(value), {
      source: value.$source,
      uid: value.$uid
    });
  }
  deserialize(value: ISerializedSyntheticObject, injector, ctor) {
    return Object.assign(this.childSerializer.deserialize(value, injector, ctor), {
      $source: value.source,
      $uid: value.uid
    });
  }
}
