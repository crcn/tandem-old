import isPublic from 'saffron-common/lib/actors/decorators/public';
import IApplication from 'saffron-common/lib/application/interface';
import BaseApplicationService from 'saffron-common/lib/services/base-application-service';

import { Bus } from 'mesh';
import { UpsertBus } from 'saffron-common/lib/busses/index';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';

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
