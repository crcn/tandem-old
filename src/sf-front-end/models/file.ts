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

  static findAll(dependencies: Dependencies) {
    return this.find(undefined, dependencies);
  }

  static async find(query: any, dependencies: Dependencies) {
    return (await find("files", query, true, dependencies)).map((sourceData) => {
      const activeRecordFactory = ActiveRecordFactoryDependency.find(MimeTypeDependency.lookup(sourceData.path, dependencies), dependencies);
      if (activeRecordFactory) return activeRecordFactory.create(sourceData);

    });
  }
}