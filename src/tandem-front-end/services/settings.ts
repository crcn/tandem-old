import  * as store from "store";
import { WrapBus } from "mesh";
import { Metadata } from "tandem-common/metadata";
import { FrontEndApplication } from "tandem-front-end/application";
import { BaseApplicationService } from "tandem-common/services";
import { ApplicationServiceDependency } from "tandem-common/dependencies";
import { InitializeAction, SettingChangeAction, LOAD } from "tandem-common/actions";

export class SettingsService extends BaseApplicationService<FrontEndApplication> {
  [LOAD](action: InitializeAction) {

    // TODO - this.app.config.settingsKey instead of hard-coded key here
    this.app.settings = new Metadata(store.get("settings"));
    this.app.settings.observe(this.bus, WrapBus.create(this._onSettingsChange));
  }

  _onSettingsChange = (action: SettingChangeAction) => {
      store.set("settings", this.app.settings.data);
  }
}

export const dependency = new ApplicationServiceDependency("settings", SettingsService);

