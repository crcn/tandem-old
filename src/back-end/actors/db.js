import Service from 'common/services/base';
import loggable from 'common/logger/mixins/loggable';
import isPublic from 'common/actors/decorators/public';
import MemoryDsBus from 'mesh-memory-ds-bus';

import { titleize } from 'inflection';
import { FactoryFragment } from 'common/fragments';

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
  find(action) {
    return this._db.execute(action);
  }

  /**
   * removes one or more items against the db
   */

  @isPublic
  remove(action) {
    return this._executeWithPostAction(action);
  }

  /**
   * inserts one or more items against the db
   */

  @isPublic
  insert(action) {
    return this._executeWithPostAction(action);
  }

  /**
   */

  @isPublic
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
  ns: 'application/actors/db',
  factory: DBService
});
