import { WrapBus } from "mesh";
import { Settings } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { InitializeAction, SettingChangeAction } from "sf-core/actions";

export class SettingsService extends BaseApplicationService<FrontEndApplication> {
  load(action: InitializeAction) {
    this.app.settings = new Settings(/* TODO - load from browser */);
    this.app.settings.observe(this.bus, WrapBus.create(this._onSettingsChange));
  }

  _onSettingsChange = (action: SettingChangeAction) => {
    // TODO - save
  }
}

export const dependency = new ApplicationServiceDependency("settings", SettingsService);

