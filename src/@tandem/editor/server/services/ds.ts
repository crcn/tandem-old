import { IActor } from "@tandem/common/actors";
import { titleize } from "inflection";
import { DSProvider } from "@tandem/editor/server/providers";
import * as MemoryDsBus from "mesh-memory-ds-bus";
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
  private _mainDs: IActor;

  private _ds: IActor;
  private _upsertBus: IActor;

  $didInject() {
    super.$didInject();

    // TODO - detch data store dependency here
    this._ds = new PostDsNotifierBus(this._mainDs, this.bus);
    this._upsertBus = UpsertBus.create(this.bus);
  }

  /**
   * finds one or more items against the database
   */

  [DSFindAction.DS_FIND](action: DSFindAction<any>) {
    return this._ds.execute(action);
  }

  /**
   * removes one or more items against the db
   */

  [DSRemoveAction.DS_REMOVE](action: DSRemoveAction<any>) {
    return this._ds.execute(action);
  }

  /**
   * inserts one or more items against the db
   */

  [DSInsertAction.DS_INSERT](action: DSInsertAction<any>) {
    return this._ds.execute(action);
  }

  /**
   */

  [DSUpdateAction.DS_UPDATE](action: DSUpdateAction<any, any>) {
    return this._ds.execute(action);
  }


  /**
   */

  [DSUpsertAction.DS_UPSERT](action: DSUpsertAction<any>) {
    return this._upsertBus.execute(action);
  }
}