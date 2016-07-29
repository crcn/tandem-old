import { ClassFactoryDependency, Dependencies } from "sf-core/dependencies";
import { IEntity, EntityEngine } from "sf-core/entities";
import { parse as parseHTML } from "../parsers/html";
import { PropertyChangeAction } from "sf-core/actions";
import { Observable } from "sf-core/observable";

export class SfFile extends Observable {
  readonly path: string;
  readonly content: string;
  readonly dependencies: Dependencies;

  private _engine: EntityEngine;
  private _entity: IEntity;

  constructor(properties: { path: string, content: string, framents: Dependencies }) {
    super();
    Object.assign(this, properties);
    this._engine = new EntityEngine(this.dependencies);
  }

  setProperties(properties) {
    Object.assign(this, properties);
  }

  get entity() {
    return this._entity;
  }

  async load() {
    this._entity = await this._engine.load(parseHTML(this.content));
    this.notify(new PropertyChangeAction("entity", this._entity, undefined));
  }
}

export const fragment = new ClassFactoryDependency("models/sfn-file", SfFile);

