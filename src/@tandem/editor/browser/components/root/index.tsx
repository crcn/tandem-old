import "./index.scss";

import * as React from "react";
import { Store } from "@tandem/editor/browser/models";
import CenterComponent from "./center";
import { StoreProvider } from "@tandem/editor/browser/providers";
import { DocumentGutterComponent } from "./document-sidebar";
import { SelectionGutterComponent } from "./selection-sidebar";
import { IActor, Injector, RootApplicationComponent, BaseApplicationComponent, inject } from "@tandem/common";


export class EditorComponent extends BaseApplicationComponent<{}, {}> {
  @inject(StoreProvider.ID)
  private _store: Store;

  render() {
    const { workspace, settings } = this._store;

    return <div className="m-editor editor">
      <DocumentGutterComponent settings={settings} workspace={workspace} />
      <CenterComponent />
      <SelectionGutterComponent settings={settings} workspace={workspace} />
    </div>;
  }
}


// prop injection doesn't exist in the root application component, so render
export class RootComponent extends RootApplicationComponent {
  render() {
    return <EditorComponent />;
  }
}

