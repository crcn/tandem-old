import  * as store from "store";
import { Store } from "@tandem/editor/browser/models";
import { CallbackDispatcher } from "@tandem/mesh";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";
import { ApplicationServiceProvider } from "@tandem/common";
import { MetadataChangeEvent, LoadRequest, Metadata, inject, loggable, Logger } from "@tandem/common";

@loggable()
export class SettingsService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(EditorStoreProvider.ID)
  private _store: Store;

  [LoadRequest.LOAD](action: LoadRequest) {

    this.logger.debug("loading settings");

    this._store.settings.setProperties(store.get("settings"));

    // TODO - don't want to do this
    this._store.settings.observe(this.bus, new CallbackDispatcher(this._onSettingsChange));
  }

  _onSettingsChange = (action: MetadataChangeEvent) => {
      store.set("settings", this._store.settings.data);
  }
}

export const settingsServiceProvider = new ApplicationServiceProvider("settings", SettingsService);

