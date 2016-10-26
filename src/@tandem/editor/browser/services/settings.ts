import  * as store from "store";
import { Store } from "@tandem/editor/browser/models";
import { WrapBus } from "mesh";
import { StoreDependency } from "@tandem/editor/browser/dependencies";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import { SettingChangeAction, LoadAction, Metadata, inject, loggable, Logger } from "@tandem/common";

@loggable()
export class SettingsService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(StoreDependency.ID)
  private _store: Store;

  [LoadAction.LOAD](action: LoadAction) {

    this.logger.verbose("loading settings");

    this._store.settings.setProperties(store.get("settings"));

    // TODO - don't want to do this
    this._store.settings.observe(this.bus, WrapBus.create(this._onSettingsChange));
  }

  _onSettingsChange = (action: SettingChangeAction) => {
      store.set("settings", this._store.settings.data);
  }
}

export const settingsServiceDependency = new ApplicationServiceDependency("settings", SettingsService);

