import isPublic from 'saffron-common/lib/actors/decorators/public';

import { Bus } from 'mesh';

import {
  IActor,
  UpsertBus,
  IApplication,
  ClassFactoryFragment,
  BaseApplicationService
} from 'saffron-common/lib/index';

export default class UpsertService extends BaseApplicationService<IApplication> {

  private _bus:Bus;

  constructor(app:IApplication) {
    super(app);
    this._bus = UpsertBus.create(this.bus);
  }

  /**
   */

  @isPublic 
  public upsert(action) {
    return this._bus.execute(action);
  }
}

export const fragment = new ClassFactoryFragment('application/services/upsert', UpsertService);
