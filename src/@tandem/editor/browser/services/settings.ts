import  * as store from "store";
import { WrapBus } from "mesh";
import { Metadata, inject } from "@tandem/common";
import { SettingsDependency } from "@tandem/editor/browser/dependencies";
import { CoreApplicationService } from "@tandem/core";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import { SettingChangeAction, LoadAction } from "@tandem/common/actions";

export class SettingsService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(SettingsDependency.ID)
  private _settings: Metadata;

  [LoadAction.LOAD](action: LoadAction) {

    console.log("loading settings");

    this._settings.setProperties(store.get("settings"));

    // TODO - don't want to do this
    this._settings.observe(this.bus, WrapBus.create(this._onSettingsChange));
  }

  _onSettingsChange = (action: SettingChangeAction) => {
      store.set("settings", this._settings.data);
  }
}

export const settingsServiceDependency = new ApplicationServiceDependency("settings", SettingsService);

