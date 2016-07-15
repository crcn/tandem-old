import Service from 'common/services/base';
import isPublic from 'common/actors/decorators/public';
import { UpsertBus } from 'common/busses';
import { FactoryFragment } from 'common/fragments';

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
  ns: 'application/actors/upsert',
  factory: UpsertService
});
