import Service from 'saffron-common/services/base';
import isPublic from 'saffron-common/actors/decorators/public';
import { UpsertBus } from 'saffron-common/busses';
import { FactoryFragment } from 'saffron-common/fragments';

export default class UpsertService extends Service {

  constructor(properties) {
    super(properties);
    this._bus = UpsertBus.create(this.bus);
  }

  /**
   */

  @isPublic
  upsert(action) {
    return this._bus.execute(action);
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/services/upsert',
  factory: UpsertService
});
