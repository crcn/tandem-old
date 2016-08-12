import { IActor } from "sf-core/actors";
import { Dependencies, MainBusDependency } from "sf-core/dependencies";
import { find, ActiveRecord } from "sf-core/active-records";

export class File extends ActiveRecord {
  public path: string;
  public content: string;
  serialize() {
    return {
      path: this.path,
      content: this.content
    };
  }
  static find(dependencies: Dependencies) {
    const bus: IActor = MainBusDependency.getInstance(dependencies);

  }
}