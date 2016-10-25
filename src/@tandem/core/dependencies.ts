import {
  IActor,
  Dependency,
  Dependencies,
  ClassFactoryDependency,
} from "@tandem/common";

export class ApplicationServiceDependency<T extends IActor> extends ClassFactoryDependency {

  static readonly NS = "services";

  constructor(name: string, value: { new(): T }) {
    super(ApplicationServiceDependency.getId(name), value);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  create(): T {
    return super.create();
  }

  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<ApplicationServiceDependency<any>>(this.getId("**"));
  }
}

/**
 * The application configuration dependency
 */

export class ApplicationConfigurationDependency<T> extends Dependency<T> {
  static ID: string = "config";
  constructor(value: T) {
    super(ApplicationConfigurationDependency.ID, value);
  }
}
