import { IActor } from 'sf-core/actors';
import { IApplication } from 'sf-core/application';

import { isPublic } from 'sf-core/decorators';
import { BaseApplicationService } from 'sf-core/services';
import { ApplicationServiceFragment } from 'sf-core/fragments';

import { UpsertBus } from 'sf-common/busses';

export default class UpsertService extends BaseApplicationService<IApplication> {

  private _bus:IActor;

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
