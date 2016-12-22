import  * as store from "store";
import { EditorStore } from "@tandem/editor/browser/stores";
import { CallbackDispatcher } from "@tandem/mesh";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ApplicationServiceProvider, CoreApplicationService } from "@tandem/common";
import { MetadataChangeEvent, LoadApplicationRequest, Metadata, inject, loggable, Logger } from "@tandem/common";

@loggable()
export class SettingsService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

  [LoadApplicationRequest.LOAD](message: LoadApplicationRequest) {

    this.logger.debug("loading settings");

    this._store.settings.setProperties(store.get("settings"));
    
    // TODO - don't want to do this
    this._store.settings.observe(this.bus, new CallbackDispatcher(this._onSettingsChange));
  }

  _onSettingsChange = (message: MetadataChangeEvent) => {
      store.set("settings", this._store.settings.data);
  }
}

export const settingsServiceProvider = new ApplicationServiceProvider("settings", SettingsService);

