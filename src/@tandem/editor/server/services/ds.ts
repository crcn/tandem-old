import { IActor } from "@tandem/common/actors";
import { titleize } from "inflection";
import * as MemoryDsBus from "mesh-memory-ds-bus";
import { UpsertBus } from "@tandem/common/busses";
import { PostDsNotifierBus } from "@tandem/common/busses";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { CoreApplicationService } from "@tandem/editor/core";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import {
  DSAction,
  DSFindAction,
  DSInsertAction,
  DSRemoveAction,
  DSUpdateAction,
  DSUpsertAction,
  PostDSAction
} from "@tandem/common/actions";

export class DSService extends  CoreApplicationService<IEdtorServerConfig> {

  private _ds: IActor;
  private _upsertBus: IActor;

  $didInject() {
    super.$didInject();

    // TODO - detch data store dependency here
    this._ds = new PostDsNotifierBus(MemoryDsBus.create(), this.bus);
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