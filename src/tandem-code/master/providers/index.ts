import { IStarterOption } from "tandem-code/common/stores";
import { BaseProjectStarter } from "tandem-code/master/project";
import { ClassFactoryProvider, Provider, Injector } from "@tandem/common";
import { StoreProvider } from "@tandem/common";
import { TandemStudioMasterStore } from "tandem-code/master/stores";


export class ProjectStarterFactoryProvider extends ClassFactoryProvider {
  static readonly NS: string = "projectStarters";
  constructor(readonly option: IStarterOption, readonly clazz: { new(option: IStarterOption): BaseProjectStarter }) {
    super(ProjectStarterFactoryProvider.getId(option.id), clazz);
  }

  create(option: IStarterOption): BaseProjectStarter {
    return super.create(option); 
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }

  clone() {
    return new ProjectStarterFactoryProvider(this.option, this.clazz);
  }

  static create(option: IStarterOption, injector: Injector) {
    const provider = injector.query<ProjectStarterFactoryProvider>(this.getId(option.id));
    return provider && provider.create(option);
  }
}

export class TandemMasterStudioStoreProvider extends StoreProvider {
  static readonly ID = StoreProvider.getId("tandemMasterStudio");
  constructor(clazz: { new(): TandemStudioMasterStore }) {
    super("tandemMasterStudio", clazz);
  }
}