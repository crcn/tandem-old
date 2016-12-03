import "./index.scss";

import * as React from "react";
import { EditorStore } from "@tandem/editor/browser/stores";
import { RouteNames } from "@tandem/editor/browser/constants";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { PageOutletComponent } from "@tandem/editor/browser/components/common";
import { Injector, RootApplicationComponent, BaseApplicationComponent, inject, Status } from "@tandem/common";

export class MainComponent extends BaseApplicationComponent<{}, {}> {

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

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
      return <PageOutletComponent routeName={RouteNames.ROOT}  />;
    }
  }
}

// prop injection doesn't exist in the root application component, so render
export class RootComponent extends RootApplicationComponent {
  render() {
    return <MainComponent />;
  }
}

