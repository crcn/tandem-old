import {
  ClassFactoryDependency,
  ActiveRecordFactoryDependency,
  IInjectable,
  Dependencies,
  DEPENDENCIES_NS
} from "sf-core/dependencies";

import { inject } from "sf-core/decorators";
import { IEntity, EntityEngine } from "sf-core/entities";
import { parse as parseHTML } from "../parsers/html";
import { PropertyChangeAction } from "sf-core/actions";
import { Observable } from "sf-core/observable";
import { IActiveRecord } from "sf-core/active-records";

export class SfFile extends Observable implements IInjectable, IActiveRecord {

  public path: string;
  public content: string;
  public ext: string;

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  private _engine: EntityEngine;
  private _entity: IEntity;

  serialize() {
    return {
      path: this.path,
      content: this.content,
      ext: this.ext
    };
  }

  deserialize(data: { path: string, content: string, ext: string }) {
    this.path    = data.path;
    this.content = data.content;
    this.ext     = data.ext;
    this._loadEntity();
  }

  didInject() {
    this._engine = new EntityEngine(this.dependencies);
  }

  /**
   * The entity object created from content
   */

  get entity() {
    return this._entity;
  }

  /**
   * Loads the entity - gets called whenever the data changes
   * on this file object
   */

  private async _loadEntity() {
    this._entity = await this._engine.load(parseHTML(this.content));

    // notify observers that the file has changed
    this.notify(new PropertyChangeAction("entity", this._entity, undefined));
  }
}

export const fragment = new ActiveRecordFactoryDependency("sfn-file", SfFile);

