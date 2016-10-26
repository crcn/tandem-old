import * as React from "react";
import * as ReactDOM from "react-dom";

import { WrapBus } from "mesh";
import { Store } from "@tandem/editor/browser/models";
import { inject, Action } from "@tandem/common";
import { StoreDependency } from "@tandem/editor/browser/dependencies";
import { RootEditorComponent } from "@tandem/editor/browser/components";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";

export class ComponentService extends CoreApplicationService<IEditorBrowserConfig> {

  @inject(StoreDependency.ID)
  private _store: Store;

  private _rendering: boolean;
  private _shouldRenderAgain: boolean;

  $didInject() {
    super.$didInject();
    this._store.observe(new WrapBus(this.onRootModelAction.bind(this)));
  }

  onRootModelAction(action: Action) {
    this.requestRender();
  }

  requestRender() {
    if (this._rendering) {
      this._shouldRenderAgain = false;
      return;
    }
    this._shouldRenderAgain = false;
    requestAnimationFrame(this.render);
  }

  render = () => {
    this._rendering = false;
    ReactDOM.render(<RootEditorComponent bus={this.bus} dependencies={this.dependencies} />, this.config.element);
    if (this._shouldRenderAgain) this.requestRender();
  }
}

