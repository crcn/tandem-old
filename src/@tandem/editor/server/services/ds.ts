import { titleize } from "inflection";
import { IDispatcher } from "@tandem/mesh";
import { DSProvider } from "@tandem/editor/server/providers";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/core";
import {
  inject,
  DSAction,
  UpsertBus,
  DSFindAction,
  PostDSAction,
  DSInsertAction,
  DSRemoveAction,
  DSUpdateAction,
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

  [DSFindAction.DS_FIND](action: DSFindAction<any>) {
    return this._ds.dispatch(action);
  }

  /**
   * removes one or more items against the db
   */

  [DSRemoveAction.DS_REMOVE](action: DSRemoveAction<any>) {
    return this._ds.dispatch(action);
  }

  /**
   * inserts one or more items against the db
   */

  [DSInsertAction.DS_INSERT](action: DSInsertAction<any>) {
    return this._ds.dispatch(action);
  }

  /**
   */

  [DSUpdateAction.DS_UPDATE](action: DSUpdateAction<any, any>) {
    return this._ds.dispatch(action);
  }


  /**
   */

  [DSUpsertAction.DS_UPSERT](action: DSUpsertAction<any>) {
    return this._upsertBus.dispatch(action);
  }
}