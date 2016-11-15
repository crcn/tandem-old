import * as sift from "sift";
import { IDispatcher } from "@tandem/mesh";
import { inject } from "@tandem/common/decorators";
import { CallbackDispatcher, readAllChunks, readOneChunk, DSFind, DSUpdate, DSInsert } from "@tandem/mesh";
import { isMaster } from "@tandem/common/workers";
import { IBrokerBus } from "@tandem/common/dispatchers";
import { IDisposable } from "@tandem/common/object";
import { IActiveRecord } from "./base";
import { ObservableCollection } from "@tandem/common/observable";
import { Injector, PrivateBusProvider, IInjectable } from "@tandem/common/ioc";
import { PostDSAction } from "@tandem/common/actions";

// TODO - remove global listener
// TODO - listen to DS mediator for updates on record collection
export class ActiveRecordCollection<T extends IActiveRecord<any>, U> extends ObservableCollection<T> implements IInjectable {
  private _sync: IDisposable;
  public collectionName: string;
  public query: Object;
  public createActiveRecord: (source: U) => T;
  private _bus: IBrokerBus;
  private _globalActionObserver: IDispatcher<any, any>;

  private constructor(...items: T[]) {
    super();
  }

  static create<T extends IActiveRecord<any>, U>(collectionName: string, injector: Injector, createActiveRecord: (source: U) => T, query: any = {}): ActiveRecordCollection<T, U> {
    return new (this as any)().setup(collectionName, injector, createActiveRecord, query);
  }

  setup(collectionName: string, injector: Injector, createActiveRecord: (source: U) => T, query?: Object) {
    this.collectionName = collectionName;
    this._bus = PrivateBusProvider.getInstance(injector);
    this.createActiveRecord = createActiveRecord;
    this._globalActionObserver = new CallbackDispatcher(this.onGlobalAction.bind(this));
    this.query = query || {};
    return this;
  }

  async reload() {
    this.splice(0, this.length);
    this.load();
  }

  async load() {

    // TODO - need to check for duplicates
    this.push(...(await readAllChunks<any>(this._bus.dispatch(new DSFind(this.collectionName, this.query, true)))).map(value => {
      return this.createActiveRecord(value);
    }));
  }

  sync() {
    if (this._sync) return this._sync;

    // TODO - this is very smelly. Collections should not be registering themselves
    // to the global message bus. Instead they should be registering themselves to a DS manager
    // which handles all incomming and outgoing DS actions from the message bus.
    this._bus.register(this._globalActionObserver);


    return this._sync = {
      dispose: () => {
        this._sync = undefined;
        this._bus.unregister(this._globalActionObserver);
      }
    }
  }

  /**
   * loads an item with the given query from the DS
   */

  async loadItem(query: any): Promise<T|undefined> {
    const { value, done } = await readOneChunk<any>(this._bus.dispatch(new DSFind(this.collectionName, query, false)));

    // item exists, so add and return it. Otherwise return undefined indicating
    // that the item does not exist.
    if (value) {
      const item = this.createActiveRecord(value);
      this.push(item);
      return item;
    }
  }

  /**
   * Loads an item into this collection if it exists, otherwise creates an item
   */

  async loadOrInsertItem(query: any, source: U = query) {
    const loadedItem = await this.loadItem(query);
    return loadedItem || this.create(source).insert();
  }

  /**
   * Synchronously creates a new active record (without persisting) with the given data
   * source.
   *
   * @param {U} source The source data represented by the new active record.
   * @returns
   */

  create(source: U) {
    const record = this.createActiveRecord(source);
    this.push(record);
    return record;
  }

  private onGlobalAction(action: PostDSAction) {
    if ((action.type === DSUpdate.DS_UPDATE || action.type === DSInsert.DS_INSERT || action.type === PostDSAction.DS_DID_UPDATE || action.type === PostDSAction.DS_DID_INSERT) && action.collectionName === this.collectionName && sift(this.query)(action.data)) {
      this._updateActiveRecord(action.data);
    }
  }

  private _updateActiveRecord(source: U) {

    let record = this.find((record) => record[record.idProperty] === source[record.idProperty]);

    if (record) {
      record.deserialize(source);
      return record;
    }

    return this.create(source);
  }
}

