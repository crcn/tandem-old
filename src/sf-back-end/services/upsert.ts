import { IActor } from "sf-common/actors";
import { DS_UPSERT } from "sf-common/actions";
import { UpsertBus } from "sf-common/busses";
import { IApplication } from "sf-common/application";
import { BaseApplicationService } from "sf-common/services";
import { ApplicationServiceDependency } from "sf-common/dependencies";

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
