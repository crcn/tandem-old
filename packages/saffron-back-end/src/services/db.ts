

import isPublic from 'saffron-common/lib/actors/decorators/public';
import document from 'saffron-common/lib/actors/decorators/document';
import * as MemoryDsBus from 'mesh-memory-ds-bus';

import { Bus } from 'mesh';
import { titleize } from 'inflection';

import {
  IActor,
  loggable,
  DBAction,
  FindAction,
  InsertAction,
  RemoveAction,
  UpdateAction,
  PostDBAction,
  IApplication,
  ClassFactoryFragment,
  BaseApplicationService
} from 'saffron-common/src/index';

@loggable
export default class DBService extends BaseApplicationService<IApplication> {
  
  private _db:IActor;

  constructor(app:IApplication) {
    super(app);
    this._db = MemoryDsBus.create();
  }

  /**
   * finds one or more items against the database
   */

  @isPublic
  @document('finds an item in the database')
  find(action:FindAction) {
    return this._db.execute(action);
  }

  /**
   * removes one or more items against the db
   */

  @isPublic
  @document('removes an item in the database')
  remove(action:RemoveAction) {
    return this._executeWithPostAction(action);
  }

  /**
   * inserts one or more items against the db
   */

  @isPublic
  @document('inserts an item in the database')
  insert(action:InsertAction) {
    return this._executeWithPostAction(action);
  }

  /**
   */

  @isPublic
  @document('updates an item in the database')
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

export const fragment = new ClassFactoryFragment('application/services/db', DBService);
