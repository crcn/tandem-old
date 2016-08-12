import { BaseApplication } from "./base";
import { fileModelDependency } from "sf-common/models";

export class Application extends BaseApplication {
  protected registerDependencies() {
    super.registerDependencies();
    this.dependencies.register(
      fileModelDependency
    );
  }
}