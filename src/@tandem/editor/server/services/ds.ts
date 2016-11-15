import { titleize } from "inflection";
import { IDispatcher, DSFind, DSInsert, DSRemove, DSUpdate } from "@tandem/mesh";
import { DSProvider } from "@tandem/editor/server/providers";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";
import {
  inject,
  DSAction,
  UpsertBus,
  PostDSAction,
  DSUpsertAction,
  PostDsNotifierBus,
  ApplicationServiceProvider,
} from "@tandem/common";

export class DSService extends  CoreApplicationService<IEdtorServerConfig> {

  @inject(DSProvider.ID)
  private _mainDs: IDispatcher<any, any>;

  private _ds: IDispatcher<any, any>;
  private _upsertBus: IDispatcher<any, any>;

  $didInject() {
    super.$didInject();

    // TODO - detch data store dependency here
    this._ds = new PostDsNotifierBus(this._mainDs, this.bus);
    this._upsertBus = new UpsertBus(this.bus);
  }

  /**
   * finds one or more items against the database
   */

  [DSFind.DS_FIND](action: DSFind<any>) {
    return this._ds.dispatch(action);
  }

  /**
   * removes one or more items against the db
   */

  [DSRemove.DS_REMOVE](action: DSRemove<any>) {
    return this._ds.dispatch(action);
  }

  /**
   * inserts one or more items against the db
   */

  [DSInsert.DS_INSERT](action: DSInsert<any>) {
    return this._ds.dispatch(action);
  }

  /**
   */

  [DSUpdate.DS_UPDATE](action: DSUpdate<any, any>) {
    return this._ds.dispatch(action);
  }


  /**
   */

  [DSUpsertAction.DS_UPSERT](action: DSUpsertAction<any>) {
    return this._upsertBus.dispatch(action);
  }
}