import Service from 'saffron-common/lib/services/base';
import isPublic from 'saffron-common/lib/actors/decorators/public';
import { UpsertBus } from 'saffron-common/lib/busses/index';
import { Bus } from 'mesh';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';

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

export const fragment = new FactoryFragment({
  ns: 'application/services/upsert',
  factory: UpsertService
});
