import { IActor } from "sf-core/actors";
import { IApplication } from "sf-core/application";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { loggable, document } from "sf-core/decorators";
import { PostDsNotifierBus } from "sf-core/busses";
import {
  DBAction,
  FindAction,
  InsertAction,
  RemoveAction,
  UpdateAction,
  PostDBAction
} from "sf-core/actions";

import * as MemoryDsBus from "mesh-memory-ds-bus";

import { titleize } from "inflection";

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
  find(action: FindAction) {
    return this._db.execute(action);
  }

  /**
   * removes one or more items against the db
   */

  @document("removes an item in the database")
  remove(action: RemoveAction) {
    return this._db.execute(action);
  }

  /**
   * inserts one or more items against the db
   */

  @document("inserts an item in the database")
  insert(action: InsertAction) {
    return this._db.execute(action);
  }

  /**
   */

  @document("updates an item in the database")
  update(action: UpdateAction) {
    return this._db.execute(action);
  }
}

export const dependency = new ApplicationServiceDependency("db", DBService);
