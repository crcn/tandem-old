import { titleize } from "inflection";
import { IDispatcher, DSFindRequest, DSInsertRequest, DSRemoveRequest, DSUpdateRequest } from "@tandem/mesh";
import { DSProvider } from "tandem-code/worker/providers";
import { BaseApplicationService } from "@tandem/core";
import {
  inject,
  UpsertBus,
  PostDSMessage,
  DSUpsertRequest,
  PostDsNotifierBus,
  ApplicationServiceProvider,
} from "@tandem/common";

export class DSService extends BaseApplicationService {

  @inject(DSProvider.ID)
  private _mainDs: IDispatcher<any, any>;

  private _ds: IDispatcher<any, any>;
  private _upsertBus: IDispatcher<any, any>;

  $didInject() {
    super.$didInject();

    // TODO - detch data store dependency here

    // post DS notifications = revoked until it's faster. -- can send large
    // payloads across the network which clogs everything up. Opt for tailing instead
    // which is more explicit.
    // this._ds = new PostDsNotifierBus(this._mainDs, this.bus);
    this._ds = this._mainDs;
    this._upsertBus = new UpsertBus(this.bus);
  }

  /**
   * finds one or more items against the database
   */

  [DSFindRequest.DS_FIND](action: DSFindRequest<any>) {
    return this._ds.dispatch(action);
  }

  /**
   * removes one or more items against the db
   */

  [DSRemoveRequest.DS_REMOVE](action: DSRemoveRequest<any>) {
    return this._ds.dispatch(action);
  }

  /**
   * inserts one or more items against the db
   */

  [DSInsertRequest.DS_INSERT](action: DSInsertRequest<any>) {
    return this._ds.dispatch(action);
  }

  /**
   */

  [DSUpdateRequest.DS_UPDATE](action: DSUpdateRequest<any, any>) {
    return this._ds.dispatch(action);
  }


  /**
   */

  [DSUpsertRequest.DS_UPSERT](action: DSUpsertRequest<any>) {
    return this._upsertBus.dispatch(action);
  }
}