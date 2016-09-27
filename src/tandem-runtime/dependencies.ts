import { IModule } from "./module";
import { ISynthetic } from "./synthetic";
import { EnvironmentKind } from "./environment";
import { ClassFactoryDependency, FactoryDependency, Dependencies } from "tandem-common";

type moduleType = { new(fileName: string, content: any): IModule };

export class ModuleFactoryDependency extends ClassFactoryDependency {
  static readonly MODULE_FACTORIES_NS = "moduleFactories";
  constructor(envKind: EnvironmentKind, mimeType: string, clazz: moduleType) {
    super(ModuleFactoryDependency.getNamespace(envKind, mimeType), clazz);
  }

  static getNamespace(envKind: EnvironmentKind, mimeType: string) {
    return [this.MODULE_FACTORIES_NS, envKind, mimeType].join("/");
  }

  create(fileName: string, content: string): IModule {
    return super.create(fileName, content);
  }

  static find(envKind: EnvironmentKind, mimeType: string, dependencies: Dependencies) {
    return dependencies.query<ModuleFactoryDependency>(this.getNamespace(envKind, mimeType));
  }
}

export class ModuleShimFactoryDependency extends FactoryDependency {

  static readonly MODULE_SHIM_FACTORIES_NS = "moduleShimFactories";

  constructor(envKind: EnvironmentKind, filePath: string, create: () => Promise<ISynthetic>) {
    super(ModuleShimFactoryDependency.getNamespace(envKind, filePath), { create });
  }

  create(): Promise<ISynthetic> {
    return super.create();
  }

  static getNamespace(envKind: EnvironmentKind, filePath: string) {
    return [this.MODULE_SHIM_FACTORIES_NS, envKind, filePath].join("/");
  }

  static find(envKind: EnvironmentKind, filePath: string, dependencies: Dependencies) {
    return dependencies.query<ModuleShimFactoryDependency>(this.getNamespace(envKind, filePath));
  }
}
