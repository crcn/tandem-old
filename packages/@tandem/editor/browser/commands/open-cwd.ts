import { ICommand, inject, Kernel, KernelProvider } from "@tandem/common";

import { EditorStore } from "@tandem/editor/browser/stores";
// import { DirectoryModel } from "@tandem/editor/common";
import { IMessage } from "@tandem/mesh";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ApplicationConfigurationProvider } from "@tandem/common";

export class OpenCWDCommand implements ICommand {

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IEditorBrowserConfig;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  async execute(message: IMessage) {
    // this._store.cwd = this._kernel.inject(new DirectoryModel(this._config.server.cwd));
    // this._store.cwd.load();
  }
}