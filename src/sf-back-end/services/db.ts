import { IActor } from "sf-core/actors";
import { IApplication } from "sf-core/application";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { BaseApplicationService } from "sf-core/services";
import { loggable, isPublic, document } from "sf-core/decorators";
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
    this._db = MemoryDsBus.create();
  }

  /**
   * finds one or more items against the database
   */

  @isPublic
  @document("finds an item in the database")
  find(action:FindAction) {
    return this._db.execute(action);
  }

  /**
   * removes one or more items against the db
   */

  @isPublic
  @document("removes an item in the database")
  remove(action:RemoveAction) {
    return this._executeWithPostAction(action);
  }

  /**
   * inserts one or more items against the db
   */

  @isPublic
  @document("inserts an item in the database")
  insert(action:InsertAction) {
    return this._executeWithPostAction(action);
  }

  /**
   */

  @isPublic
  @document("updates an item in the database")
  update(action:UpdateAction) {
    return this._executeWithPostAction(action);
  }

  /**
   */

  async _executeWithPostAction(action:UpdateAction|RemoveAction|InsertAction)  {

    var data = await this._db.execute(action).readAll();

    if (data.length) {
      this.bus.execute(PostDBAction.createFromDBAction(action, data));
    }

    return data;
  }
}

export const fragment = new ApplicationServiceDependency("db", DBService);
