import { IActor } from "sf-common/actors";
import { titleize } from "inflection";
import * as MemoryDsBus from "mesh-memory-ds-bus";
import { IApplication } from "sf-common/application";
import { PostDsNotifierBus } from "sf-common/busses";
import { loggable, document } from "sf-common/decorators";
import { BaseApplicationService } from "sf-common/services";
import { ApplicationServiceDependency } from "sf-common/dependencies";
import {
  DSAction,
  DS_FIND,
  DS_INSERT,
  DS_UPDATE,
  DS_REMOVE,
  DSFindAction,
  DSInsertAction,
  DSRemoveAction,
  DSUpdateAction,
  PostDSAction
} from "sf-common/actions";

@loggable()
export default class DBService extends BaseApplicationService<IApplication> {

  private _db:IActor;

  didInject() {
    this._db = new PostDsNotifierBus(MemoryDsBus.create(), this.bus);
  }

  /**
   * finds one or more items against the database
   */

  @document("finds an item in the database")
  [DS_FIND](action: DSFindAction) {
    return this._db.execute(action);
  }

  /**
   * removes one or more items against the db
   */

  @document("removes an item in the database")
  [DS_REMOVE](action: DSRemoveAction) {
    return this._db.execute(action);
  }

  /**
   * inserts one or more items against the db
   */

  @document("inserts an item in the database")
  [DS_INSERT](action: DSInsertAction) {
    return this._db.execute(action);
  }

  /**
   */

  @document("updates an item in the database")
  [DS_UPDATE](action: DSUpdateAction) {
    return this._db.execute(action);
  }
}

export const dependency = new ApplicationServiceDependency("db", DBService);
