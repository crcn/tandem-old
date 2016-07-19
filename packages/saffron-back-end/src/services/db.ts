import Service from 'saffron-common/lib/services/base';
import loggable from 'saffron-common/lib/logger/mixins/loggable';
import isPublic from 'saffron-common/lib/actors/decorators/public';
import * as MemoryDsBus from 'mesh-memory-ds-bus';
import { Bus } from 'mesh';

import { titleize } from 'inflection';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';
import document from 'saffron-common/lib/actors/decorators/document';

@loggable
export default class DBService extends Service {
  
  private _db:Bus;

  constructor(properties) {
    super(properties);
    this._db = MemoryDsBus.create();
  }

  /**
   * finds one or more items against the database
   */

  @isPublic
  @document('finds an item in the database')
  find(action) {
    return this._db.execute(action);
  }

  /**
   * removes one or more items against the db
   */

  @isPublic
  @document('removes an item in the database')
  remove(action) {
    return this._executeWithPostAction(action);
  }

  /**
   * inserts one or more items against the db
   */

  @isPublic
  @document('inserts an item in the database')
  insert(action) {
    return this._executeWithPostAction(action);
  }

  /**
   */

  @isPublic
  @document('updates an item in the database')
  update(action) {
    return this._executeWithPostAction(action);
  }

  /**
   */

  async _executeWithPostAction(action)  {

    var data = await this._db.execute(action).readAll();

    if (data.length) {
      this.bus.execute({
        type: `did${titleize(action.type)}`,
        collectionName: action.collectionName,
        data: data
      });
    }

    return data;
  }
}

export const fragment = new FactoryFragment({
  ns: 'application/services/db',
  factory: DBService
});
