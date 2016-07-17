import Service from 'saffron-common/services/base';
import loggable from 'saffron-common/logger/mixins/loggable';
import isPublic from 'saffron-common/actors/decorators/public';
import MemoryDsBus from 'mesh-memory-ds-bus';

import { titleize } from 'inflection';
import { FactoryFragment } from 'saffron-common/fragments';
import document from 'saffron-common/actors/decorators/document';

@loggable
export default class DBService extends Service {

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

export const fragment = FactoryFragment.create({
  ns: 'application/services/db',
  factory: DBService
});
