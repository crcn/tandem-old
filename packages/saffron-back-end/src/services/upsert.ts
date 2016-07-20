import BaseApplicationService from 'saffron-common/lib/services/base-application-service';
import isPublic from 'saffron-common/lib/actors/decorators/public';
import { UpsertBus } from 'saffron-common/lib/busses/index';
import { Bus } from 'mesh';
import IApplication from 'saffron-common/lib/application/interface';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';

export default class UpsertService extends BaseApplicationService {

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
