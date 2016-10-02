import { IModule } from "./module";
import { EnvironmentKind } from "./environment";
import { ISynthetic, SyntheticNode, BaseSyntheticNodeComponent, HTMLNodeType } from "./synthetic";
import { ClassFactoryDependency, FactoryDependency, Dependencies } from "@tandem/common";

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

type componentClassType = { new(target: SyntheticNode): BaseSyntheticNodeComponent<any> };


export class SyntheticNodeComponentFactory extends ClassFactoryDependency {
  static readonly SYNTHETIC_NODE_COMPONENT_FACTORIES_NS = "syntheticNodeComponentFactories";
  constructor(nodeName: string, nodeType: HTMLNodeType, readonly componentClass: componentClassType) {
    super(SyntheticNodeComponentFactory.getNamespace(nodeName, nodeType), componentClass);
  }

  create(node: SyntheticNode): BaseSyntheticNodeComponent<any>  {
    return super.create(node);
  }

  static getNamespace(nodeName: string, nodeType: number) {
    return [this.SYNTHETIC_NODE_COMPONENT_FACTORIES_NS, nodeType, nodeName].join("/");
  }

  static find(nodeName: string, nodeType: number, dependencies: Dependencies): SyntheticNodeComponentFactory {
    return dependencies.query<SyntheticNodeComponentFactory>(this.getNamespace(nodeName, nodeType));
  }

  static create(node: SyntheticNode, dependencies: Dependencies) {
    const factory = this.find(node.nodeName.value, node.nodeType, dependencies) || this.find("default", node.nodeType, dependencies);
    if (!factory) {
      throw new Error(`Synthetic node component factory does not exist for node ${node.nodeName}:${node.nodeType}.`);
    }
    return factory.create(node);
  }
}