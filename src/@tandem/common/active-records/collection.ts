import * as sift from "sift";
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import { WrapBus } from "mesh";
import { isMaster } from "@tandem/common/workers";
import { IBrokerBus } from "@tandem/common/busses";
import { IDisposable } from "@tandem/common/object";
import { IActiveRecord } from "./base";
import { ObservableCollection } from "@tandem/common/observable";
import { PostDSAction, DSFindAction } from "@tandem/common/actions";
import { Dependencies, MainBusDependency, IInjectable } from "@tandem/common/dependencies";

export class ActiveRecordCollection<T extends IActiveRecord, U> extends ObservableCollection<T> implements IInjectable {
  private _sync: IDisposable;
  public collectionName: string;
  public query: Object;
  public createActiveRecord: (source: U) => T;
  private _bus: IBrokerBus;
  private _globalActionObserver: IActor;

  private constructor(...items: T[]) {
    super();
  }

  static create<T extends IActiveRecord, U>(collectionName: string, dependencies: Dependencies, createActiveRecord: (source: U) => T, query: any = {}): ActiveRecordCollection<T, U> {
    return new (this as any)().setup(collectionName, dependencies, createActiveRecord, query);
  }

  setup(collectionName: string, dependencies: Dependencies, createActiveRecord: (source: U) => T, query?: Object) {
    this.collectionName = collectionName;
    this._bus = MainBusDependency.getInstance(dependencies);
    this.createActiveRecord = createActiveRecord;
    this._globalActionObserver = new WrapBus(this.onGlobalAction.bind(this));
    this.query = query || {};
    return this;
  }


  async load() {
    this.push(...(await this._bus.execute(new DSFindAction(this.collectionName, this.query, true)).readAll()).map(this.createActiveRecord.bind(this)));
  }

  sync() {
    if (this._sync) return this._sync;
    this._bus.register(this._globalActionObserver);
    return this._sync = {
      dispose: () => {
        this._sync = undefined;
        this._bus.unregister(this._globalActionObserver);
      }
    }
  }

  create(source: U) {
    const record = this.createActiveRecord(source);
    this.push(record);
    return record;
  }

  private onGlobalAction(action: PostDSAction) {
    if ((action.type === PostDSAction.DS_DID_UPDATE || action.type === PostDSAction.DS_DID_INSERT) && action.collectionName === this.collectionName && sift(this.query)(action.data)) {
      this._updateActiveRecord(action.data);
    }
  }

  private _updateActiveRecord(source: U) {

    let record = this.find((record) => record[record.idProperty] === source[record.idProperty]);

    if (record) {
      record.deserialize(source);
      return record;
    }

    this.push(record = this.createActiveRecord(source));
    return record;
  }
}

