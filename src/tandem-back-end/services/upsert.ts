import { IActor } from "tandem-common/actors";
import { DS_UPSERT } from "tandem-common/actions";
import { UpsertBus } from "tandem-common/busses";
import { IApplication } from "tandem-common/application";
import { BaseApplicationService } from "tandem-common/services";
import { ApplicationServiceDependency } from "tandem-common/dependencies";

export default class UpsertService extends BaseApplicationService<IApplication> {

  private _bus:IActor;

  didInject() {
    this._bus = UpsertBus.create(this.bus);
  }

  /**
   */

  [DS_UPSERT](action) {
    return this._bus.execute(action);
  }
}

export const dependency = new ApplicationServiceDependency("upsert", UpsertService);
