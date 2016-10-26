import * as React from "react";
import * as ReactDOM from "react-dom";

import { RootEditorComponent } from "@tandem/editor/browser/components";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { CoreApplicationService } from "@tandem/core";

export class ComponentService extends CoreApplicationService<IEditorBrowserConfig> {

  private _rendering: boolean;

  execute() {
    if (this._rendering) return;
    this._rendering = true;
    requestAnimationFrame(this.render);
  }

  render = () => {
    this._rendering = false;
    ReactDOM.render(<RootEditorComponent bus={this.bus} dependencies={this.dependencies} />, this.config.element);
  }
}

