import * as sift from "sift";
import { inject } from "@tandem/common/decorators";
import { IActor } from "@tandem/common/actors";
import * as mongoid from "mongoid-js";
import { IDisposable } from "@tandem/common/object";
import { IBrokerBus, TypeWrapBus } from "@tandem/common/busses";
import { Observable, IObservable } from "@tandem/common/observable";
import { WrapBus, AcceptBus, ParallelBus } from "mesh";
import { Dependencies, MainBusDependency, IInjectable, Injector } from "@tandem/common/dependencies";
import {
  Action,
  DSAction,
  DSFindAction,
  PostDSAction,
  DisposeAction,
  DSRemoveAction,
  DSInsertAction,
  DSUpdateAction,
  ActiveRecordAction,
} from "@tandem/common/actions";

export interface IActiveRecord extends IObservable, IInjectable, IDisposable {
  collectionName: string;
  idProperty: string;
  save();
  insert();
  remove();
  update();

  /**
   * @deprecated
   */

  serialize();

  /**
   * @deprecated
   */

  deserialize(value: any);
}

// TODO - need to queue actions
// TODO - add schema here

export abstract class BaseActiveRecord<T> extends Observable implements IActiveRecord {
  readonly idProperty: string = "_id";

  constructor(private _source: T, readonly collectionName: string, @inject(MainBusDependency.NS) readonly bus: IActor) {
    super();
    if (this._source) {
      this.setPropertiesFromSource(_source);
    }
  }

  get isNew() {
    return this[this.idProperty] == null;
  }

  get source() {
    return this._source;
  }

  reload() {
    return this.fetch(new DSFindAction(this.collectionName, this.sourceQuery));
  }

  save() {
    return this.isNew ? this.insert() : this.update();
  }

  dispose() {
    this.notify(new DisposeAction());
  }

  insert() {
    this.willSave();
    const newData = this.serialize();
    if (newData[this.idProperty] == null) {
      newData[this.idProperty] = String(mongoid());
    }
    return this.fetch(new DSInsertAction(this.collectionName, newData));
  }

  remove() {
    return this.fetch(new DSRemoveAction(this.collectionName, this.sourceQuery));
  }

  protected get sourceQuery() {
    if (this.isNew) {
      throw new Error("Cannot query active record if it does not have an identifier.");
    };

    const id = this[this.idProperty];
    return {
      [this.idProperty]: id
    };
  }

  protected shouldUpdate() {
    return true;
  }

  /**
   * Called immediately before update()
   * @protected
   */

  protected willUpdate() {

  }

  /**
   * Called immediately before insert() and update()
   */

  protected willSave() {

  }

  update() {
    if (!this.shouldUpdate()) {
      return Promise.resolve(this);
    }
    this.willUpdate();
    this.willSave();
    const newData = this.serialize();
    return this.fetch(new DSUpdateAction(this.collectionName, newData, this.sourceQuery));
  }

  abstract serialize(): T;

  toJSON() {
    return this.serialize();
  }

  deserialize(source: T) {
    if (this.shouldDeserialize(source)) {
      this._source = source;
      this.setPropertiesFromSource(source);
      this.notify(new ActiveRecordAction(ActiveRecordAction.ACTIVE_RECORD_DESERIALIZED));
    }
  }

  protected shouldDeserialize(b: T) {
    return true;
  }

  protected setPropertiesFromSource(source: T) {

    this._source = source;

    for (const key in source) {
      this[key] = source[key];
    }
  }

  async fetch(action: Action) {
    const chunk = await this.bus.execute(action).read();
    if (!chunk.done) {
      this.setPropertiesFromSource(chunk.value);
    }
    return this;
  }
}

