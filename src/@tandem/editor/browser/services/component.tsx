import React =  require("react");
import ReactDOM = require("react-dom");

import { CallbackDispatcher } from "@tandem/mesh";
import { EditorStore } from "@tandem/editor/browser/stores";
import { inject, CoreEvent, StoreProvider } from "@tandem/common";
import { RootComponent } from "@tandem/editor/browser/components";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";

export class ComponentService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(StoreProvider.getId("**"))
  private _stores: EditorStore[];

  private _rendering: boolean;
  private _shouldRenderAgain: boolean;

  $didInject() {
    super.$didInject();
    for (const store of this._stores) {
      store.observe(new CallbackDispatcher(this.onRootModelAction.bind(this)));
    }
  }

  onRootModelAction(action: CoreEvent) {
    this.requestRender();
  }

  requestRender() {
    if (this._rendering) {
      this._shouldRenderAgain = false;
      return;
    }
    this._rendering = true;
    this._shouldRenderAgain = false;
    requestAnimationFrame(this.render);
  }

  render = () => {
    this._rendering = false;
    ReactDOM.render(<RootComponent bus={this.bus} injector={this.injector} />, this.config.element);
    if (this._shouldRenderAgain) this.requestRender();
  }
}

