import Service from 'saffron-common/services/base';
import isPublic from 'saffron-common/actors/decorators/public';
import { UpsertBus } from 'saffron-common/busses/index';
import { Bus } from 'mesh';
import { FactoryFragment } from 'saffron-common/fragments/index';

export default class UpsertService extends Service {

  private _bus:Bus;

  constructor(properties) {
    super(properties);
    this._bus = UpsertBus.create(this.bus);
  }

  /**
   */

  @isPublic 
  public upsert(action) {
    return this._bus.execute(action);
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/services/upsert',
  factory: UpsertService
});
