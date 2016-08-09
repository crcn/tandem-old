import {
  ClassFactoryDependency,
  ActiveRecordFactoryDependency,
  IInjectable,
  Dependencies,
  DEPENDENCIES_NS,
  BUS_NS
} from "sf-core/dependencies";

import { IActor } from "sf-core/actors";
import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import mergeHTML from "./merge-html";
import { Observable } from "sf-core/observable";
import { IEditorFile } from "sf-front-end/models/base";
import { IActiveRecord } from "sf-core/active-records";
import { IEntity, EntityEngine } from "sf-core/entities";
import { parse as parseHTML } from "sf-html-extension/parsers/html";
import { PropertyChangeAction, UpdateAction } from "sf-core/actions";

export class SfFile extends Observable implements IInjectable, IActiveRecord, IEditorFile {

  public path: string;
  public content: string;
  public ext: string;
  readonly type: string = "text/html";

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  @inject(BUS_NS)
  readonly bus: IActor;

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
    this.content = mergeHTML(this.content, this._entity.expression.toString());

    // TODO - beautify new content here

    this.bus.execute(new UpdateAction("files", this.serialize(), {
      path: this.path
    }));
  }
}

export const dependency = new ActiveRecordFactoryDependency("sfn-file", SfFile);

