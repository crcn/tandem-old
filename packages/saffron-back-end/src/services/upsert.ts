import { IActor } from 'saffron-base/src/actors';
import { IApplication } from 'saffron-base/src/application';

import { isPublic } from 'saffron-core/src/decorators';
import { BaseApplicationService } from 'saffron-core/src/services';
import { ApplicationServiceFragment } from 'saffron-core/src/fragments';

import { UpsertBus } from 'saffron-common/src/busses';

export default class UpsertService extends BaseApplicationService<IApplication> {

  private _bus:UpsertBus;

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

export const fragment = new ApplicationServiceFragment('upsert', UpsertService);
