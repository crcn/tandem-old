import { ICommand, inject, Injector, InjectorProvider } from "@tandem/common";

import { Store } from "@tandem/editor/browser/stores";
import { DirectoryModel } from "@tandem/editor/common";
import { IMessage } from "@tandem/mesh";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ApplicationConfigurationProvider } from "@tandem/core";

export class OpenCWDCommand implements ICommand {

  @inject(EditorStoreProvider.ID)
  private _store: Store;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEditorBrowserConfig;

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  async execute(action: IMessage) {
    this._store.cwd = this._injector.inject(new DirectoryModel(this._config.server.cwd));
    this._store.cwd.load();
  }
}