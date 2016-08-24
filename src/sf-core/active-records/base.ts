import * as sift from "sift";
import { inject } from "sf-core/decorators";
import { IActor } from "sf-core/actors";
import * as mongoid from "mongoid-js";
import { IDisposable } from "sf-core/object";
import { ISerializable } from "sf-core/serialize";
import { IBrokerBus, TypeWrapBus } from "sf-core/busses";
import { Observable, IObservable } from "sf-core/observable";
import { WrapBus, AcceptBus, ParallelBus } from "mesh";
import { Dependencies, MainBusDependency, IInjectable, MAIN_BUS_NS } from "sf-core/dependencies";
import {
  Action,
  DBAction,
  DID_INSERT,
  DID_REMOVE,
  DID_UPDATE,
  FindAction,
  UpdateAction,
  PostDBAction,
  RemoveAction,
  InsertAction,
  DisposeAction,
} from "sf-core/actions";

export interface IActiveRecord extends IObservable, ISerializable, IInjectable, IDisposable {
  collectionName: string;
  idProperty: string;
  save();
  sync();
  insert();
  remove();
  update();
}

// TODO - need to queue actions
// TODO - add schema here
export abstract class ActiveRecord extends Observable implements IActiveRecord {

  @inject(MAIN_BUS_NS)
  readonly bus: IBrokerBus;

  readonly collectionName: string;

  constructor() {
    super();
  }

  readonly idProperty: string = "_id";

  // the single source of truth data. This is immutable.
  protected _sourceData: any;

  private _syncBus: IActor;
  private _syncTimestamp: number = 0;

  get isNew() {
    return this[this.idProperty] == null;
  }

  didInject() { }

  load() {
    return this.fetch(new FindAction(this.collectionName, this.sourceQuery, false));
  }

  save() {
    return this.isNew ? this.insert() : this.update();
  }

  sync() {

    if (this._syncBus) return this;

    // TODO - this is not very efficient. Need to attach
    // sync helper here that all models listen to
    this.bus.register(this._syncBus = new AcceptBus(
      sift({ collectionName: this.collectionName, [`data.${this.idProperty}`]: this[this.idProperty] }),
      new ParallelBus([
        new TypeWrapBus(DID_UPDATE, this._onDidUpdate),
        new TypeWrapBus(DID_REMOVE, this.dispose)
      ]),
      null
    ));

    return this;
  }

  _onDidUpdate = (action: PostDBAction) => {
    // ignore if the DS action is older than the update action here
    if (action.timestamp <= this._syncTimestamp) return;
    this.deserialize(action.data);
  }

  dispose = () => {
    if (this._syncBus) {
      this.bus.unregister(this._syncBus);
    }
    this.notify(new DisposeAction());
  }

  insert() {
    const data = this.serialize();
    try {
      data[this.idProperty] = String(mongoid());
    } catch (e) {
      console.log(e.stack);
    }

    return this.fetch(new InsertAction(this.collectionName, data));
  }

  remove() {
    return this.fetch(new RemoveAction(this.collectionName, this.sourceQuery));
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

  update() {
    return this.fetch(new UpdateAction(this.collectionName, this.serialize(), this.sourceQuery));
  }

  abstract serialize();

  deserialize(sourceData: any) {
    this._sourceData = sourceData;

    for (const key in sourceData) {
      this[key] = sourceData[key];
    }
  }

  async fetch(action: Action) {
    this._syncTimestamp = Date.now();
    const chunk = await this.bus.execute(action).read();
    if (!chunk.done) {
      this.deserialize(chunk.value);
    }
    return this;
  }
}


export class ActiveRecordCollection extends Array<IActiveRecord> {
  constructor(readonly dependencies: Dependencies, query?: any) {
    super();
  }

  load() {

  }
}

function executeDbAction(collectionName: string, dependencies: Dependencies) {

}

export async function find(collectionName: string, query: any, multi: boolean, dependencies: Dependencies) {
  const bus: IActor = MainBusDependency.getInstance(dependencies);
  const result = await bus.execute(new FindAction(collectionName, query, multi)).readAll();
  return multi ? result : result[0];
}

export async function insert(collectionName: string, data: any, dependencies: Dependencies) {

}