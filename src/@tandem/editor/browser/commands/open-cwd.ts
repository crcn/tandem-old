import { IActor, Action, inject, Injector, InjectorProvider } from "@tandem/common";

import { Store } from "@tandem/editor/browser/models";
import { Directory } from "@tandem/editor/common";
import { StoreProvider } from "@tandem/editor/browser/providers";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ApplicationConfigurationProvider } from "@tandem/core";

export class OpenCWDCommand implements IActor {

  @inject(StoreProvider.ID)
  private _store: Store;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEditorBrowserConfig;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async execute(action: Action) {
    this._store.cwd = this._injector.inject(new Directory(this._config.server.cwd));
    this._store.cwd.load();
  }
}