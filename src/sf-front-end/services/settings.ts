import { Settings } from "sf-front-end/models";
import { BubbleBus } from "sf-core/busses";
import { InitializeAction } from "sf-core/actions";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";

export class SettingsService extends BaseApplicationService<FrontEndApplication> {
  load(action: InitializeAction) {
    this.app.settings = new Settings(/* TODO - load from browser */);
    this.bus.register(new BubbleBus(this.app.settings));
  }
}

export const dependency = new ApplicationServiceDependency("settings", SettingsService);

