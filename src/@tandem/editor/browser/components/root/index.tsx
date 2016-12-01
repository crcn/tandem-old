import "./index.scss";

import * as React from "react";
import { Store } from "@tandem/editor/browser/models";
import { WorkspaceComponent } from "./workspace";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { Injector, RootApplicationComponent, BaseApplicationComponent, inject, Status } from "@tandem/common";

export class MainComponent extends BaseApplicationComponent<{}, {}> {

  @inject(EditorStoreProvider.ID)
  private _store: Store;

  render() {
    return <div className="td-main">  
      { this.renderPage() }
    </div>;
  }

  renderPage() {
    const status = this._store.status;
    if (status.type === Status.LOADING) {
      return <div className="loading">
      </div>;
    } else if (status.type === Status.COMPLETED) {
      return <WorkspaceComponent />;
    }
  }
}

// prop injection doesn't exist in the root application component, so render
export class RootComponent extends RootApplicationComponent {
  render() {
    return <MainComponent />;
  }
}

