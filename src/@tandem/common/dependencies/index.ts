import { IActor } from "../actors";
import { ITyped } from "@tandem/common/object";
import { INamed } from "@tandem/common/object";
import { IBrokerBus } from "../busses";
import { IApplication } from "@tandem/common/application";
import { IEntity, IEntityDocument, IASTNode } from "@tandem/common/lang";
import { Action, IFileModelActionResponseData } from "../actions";

import { File } from "@tandem/common/models";
import {
  IFactory,
  Dependency,
  IDependency,
  Dependencies,
  ClassFactoryDependency,
 } from "./base";

// TODO - add more static find methods to each Dependency here

export * from "./base";

/**
 */

export const APPLICATION_SERVICES_NS = "application/services";
export class ApplicationServiceDependency extends ClassFactoryDependency implements IFactory {

  constructor(id: string, clazz: { new(): IActor }) {
    super(`${APPLICATION_SERVICES_NS}/${id}`, clazz);
  }

  create(): IActor {
    return super.create();
  }

  static findAll(Dependencies: Dependencies): Array<ApplicationServiceDependency> {
    return Dependencies.queryAll<ApplicationServiceDependency>(`${APPLICATION_SERVICES_NS}/**`);
  }
}

/**
 */

export const APPLICATION_SINGLETON_NS = "singletons/application";
export class ApplicationSingletonDependency extends Dependency<IApplication> {

  constructor(value: IApplication) {
    super(APPLICATION_SINGLETON_NS, value);
  }

  static find(Dependencies: Dependencies): ApplicationSingletonDependency {
    return Dependencies.query<ApplicationSingletonDependency>(APPLICATION_SINGLETON_NS);
  }
}

/**
 */

export const ENTITIES_NS = "entities";

// TODO - possibly require renderer here as well
export class EntityFactoryDependency extends ClassFactoryDependency {

  constructor(readonly expressionClass: { new(...rest): IASTNode }, readonly entityClass: { new(source: IASTNode): IEntity }, readonly name?: string) {
    super(EntityFactoryDependency.getNamespace(expressionClass, name), entityClass);
  }

  clone() {
    return new EntityFactoryDependency(this.expressionClass, this.entityClass, this.name);
  }

  create(source: IASTNode) {
    return super.create(source);
  }

  static getNamespace(expressionClass: Function, name?: string) {
    return [ENTITIES_NS, expressionClass.name, name || "default"].join("/");
  }

  static findBySourceType(expressonClass: Function, dependencies: Dependencies) {
    return dependencies.query<EntityFactoryDependency>(this.getNamespace(expressonClass));
  }

  static findAll(dependencies: Dependencies): Array<EntityFactoryDependency> {
    return dependencies.queryAll<EntityFactoryDependency>([ENTITIES_NS, "**"].join("/"));
  }

  static findBySource(source: IASTNode, dependencies: Dependencies) {
    return dependencies.query<EntityFactoryDependency>(this.getNamespace(source.constructor, (<INamed><any>source).name)) ||
    this.findBySourceType(source.constructor, dependencies);
  }

  static createEntityFromSource(source: IASTNode, dependencies: Dependencies) {

    const dependency = this.findBySource(source, dependencies);

    if (!dependency) {
      throw new Error(`Unable to find entity factory for source type "${source.constructor.name}".`);
    }

    return dependency.create(source);
  }
}

export const ENTITY_DOCUMENT_NS = "entityDocument";
export class EntityDocumentDependency extends Dependency<IEntityDocument> {
  constructor(document: IEntityDocument) {
    super(ENTITY_DOCUMENT_NS, document, true);
  }
}

/**
 */

export const MAIN_BUS_NS = "mainBus";
export class MainBusDependency extends Dependency<IBrokerBus> {
  constructor(value: IBrokerBus) {
    super(MAIN_BUS_NS, value);
  }
  static getInstance(Dependencies: Dependencies): IBrokerBus {
    return Dependencies.query<MainBusDependency>(MAIN_BUS_NS).value;
  }
}

/**
 */

export const DEPENDENCIES_NS = "dependencies";
export class DependenciesDependency extends Dependency<Dependencies> {
  constructor() {
    super(DEPENDENCIES_NS, null);
  }

  get dependencies(): Dependencies {
    return this.value;
  }

  set dependencies(value: Dependencies) {
    this.value = value;
  }
}


/**
 */

export const FILE_FACTORY_NS = "fileFactories";
export class FileFactoryDependency extends ClassFactoryDependency {
  constructor(mimeType: string, value: { new(sourceData: IFileModelActionResponseData): File }) {
    super([FILE_FACTORY_NS, mimeType].join("/"), value);
  }

  create(sourceData: any): any {
    return super.create(sourceData);
  }

  static find(mimetype: string, dependencies: Dependencies): FileFactoryDependency {
    return dependencies.query<FileFactoryDependency>([FILE_FACTORY_NS, mimetype].join("/"));
  }
}

/**
 */

export const COMMAND_FACTORY_NS = "commands";
export class CommandFactoryDependency extends ClassFactoryDependency {
  readonly actionFilter: Function;
  constructor(actionFilter: string|Function, readonly clazz: { new(): IActor }) {
    super([COMMAND_FACTORY_NS, clazz.name].join("/"), clazz);
    if (typeof actionFilter === "string") {
      this.actionFilter = (action: Action) => action.type === actionFilter;
    } else {
      this.actionFilter = actionFilter;
    }
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.query<CommandFactoryDependency>([COMMAND_FACTORY_NS, "**"].join("/"));
  }

  clone() {
    return new CommandFactoryDependency(this.actionFilter, this.clazz);
  }
}

/**
 */

export const MIME_TYPE_NS = "mimeType";
export class MimeTypeDependency extends Dependency<string> {
  constructor(readonly fileExtension: string, readonly mimeType: string) {
    super([MIME_TYPE_NS, fileExtension].join("/"), mimeType);
  }
  clone() {
    return new MimeTypeDependency(this.fileExtension, this.mimeType);
  }
  static findAll(dependencies: Dependencies) {
    return dependencies.queryAll<MimeTypeDependency>([MIME_TYPE_NS, "**"].join("/"));
  }
  static lookup(filepath: string, dependencies: Dependencies): string {
    const extension = filepath.split(".").pop();
    const dep = dependencies.query<MimeTypeDependency>([MIME_TYPE_NS, extension].join("/"));
    return dep ? dep.value : undefined;
  }
}
