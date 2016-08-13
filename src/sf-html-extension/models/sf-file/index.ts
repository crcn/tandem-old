
import mergeHTML from "./merge-html";
import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { Observable } from "sf-core/observable";
import { EntityFile } from "sf-front-end/models/base";
import { parse as parseHTML } from "sf-html-extension/parsers/html";
import { IEntity, EntityEngine } from "sf-core/entities";
import { IActiveRecord, ActiveRecord } from "sf-core/active-records";
import { PropertyChangeAction, UpdateAction } from "sf-core/actions";

import {
  IInjectable,
  MAIN_BUS_NS,
  Dependencies,
  DEPENDENCIES_NS,
  ClassFactoryDependency,
  ActiveRecordFactoryDependency
} from "sf-core/dependencies";

export class SfFile extends EntityFile implements IInjectable {

  public path: string;
  public content: string;
  readonly idProperty: string = "path";
  public ext: string;
  readonly type: string = "text/html";

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  private _entityObserver: IActor;
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
    this._entityObserver = new BubbleBus(this);
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
    if (this._entity) this._entity.unobserve(this._entityObserver);
    this._entity = await this._engine.load(parseHTML(this.content));

    // re-notify observers of this model when the entity changes
    this._entity.observe(this._entityObserver);

    // notify observers that the file has changed
    this.notify(new PropertyChangeAction("entity", this._entity, undefined));
  }

  /**
   */

  public save() {

    // copy whitespace over to new content
    this.content = mergeHTML(this.content, this._entity.source.toString());

    // TODO - beautify new content here

    return super.save();
  }
}

export const dependency = new ActiveRecordFactoryDependency("text/html", SfFile);

