import { IActor } from "@tandem/common/actors";
import { UpsertBus } from "@tandem/common/busses";
import { IApplication } from "@tandem/common/application";
import { DSUpsertAction } from "@tandem/common/actions";
import { BaseApplicationService } from "@tandem/common/services";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";

export default class UpsertService extends BaseApplicationService<IApplication> {

  private _bus:IActor;

  didInject() {
    this._bus = UpsertBus.create(this.bus);
  }

  /**
   */

  [DSUpsertAction.DS_UPSERT](action: DSUpsertAction<any>) {
    return this._bus.execute(action);
  }
}

export const upsertServiceDependency = new ApplicationServiceDependency("upsert", UpsertService);
