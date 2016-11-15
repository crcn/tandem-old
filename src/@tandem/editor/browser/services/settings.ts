import  * as store from "store";
import { Store } from "@tandem/editor/browser/models";
import { CallbackDispatcher } from "@tandem/mesh";
import { StoreProvider } from "@tandem/editor/browser/providers";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";
import { ApplicationServiceProvider } from "@tandem/common";
import { SettingChangeAction, LoadAction, Metadata, inject, loggable, Logger } from "@tandem/common";

@loggable()
export class SettingsService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(StoreProvider.ID)
  private _store: Store;

  [LoadAction.LOAD](action: LoadAction) {

    this.logger.verbose("loading settings");

    this._store.settings.setProperties(store.get("settings"));

    // TODO - don't want to do this
    this._store.settings.observe(this.bus, new CallbackDispatcher(this._onSettingsChange));
  }

  _onSettingsChange = (action: SettingChangeAction) => {
      store.set("settings", this._store.settings.data);
  }
}

export const settingsServiceProvider = new ApplicationServiceProvider("settings", SettingsService);

