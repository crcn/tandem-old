import { IActor } from "sf-core/actors";
import { Dependencies, MainBusDependency, MimeTypeDependency, ActiveRecordFactoryDependency } from "sf-core/dependencies";
import { find } from "sf-core/active-records";

export class File {

  /**
   * The file path
   * @type {string}
   */

  path: string;

  /**
   * The file content
   */

  content: string;

  constructor(sourceData: any) {
  }

}