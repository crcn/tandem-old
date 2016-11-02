import "./index.scss";

import * as React from "react";
import { Store } from "@tandem/editor/browser/models";
import CenterComponent from "./center";
import { StoreProvider } from "@tandem/editor/browser/providers";
import { GutterComponent } from "./gutter";
import { SelectionGutterComponent } from "./selection-sidebar";
import { IActor, Injector, RootApplicationComponent, BaseApplicationComponent, inject } from "@tandem/common";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { DOCUMENT_PANE_COMPONENT_NS, ENTITY_PANE_COMPONENT_NS } from "@tandem/editor/browser/providers";


export class EditorComponent extends BaseApplicationComponent<{}, {}> {
  @inject(StoreProvider.ID)
  private _store: Store;

  render() {
    const { workspace, settings } = this._store;

    return <div className="m-editor editor">
      <GutterComponent style={{width:300}}>
        <RegisteredComponent workspace={workspace} ns={[DOCUMENT_PANE_COMPONENT_NS, "**"].join("/")} />
      </GutterComponent>
      <CenterComponent />
      <GutterComponent style={{width:350}}>
        <RegisteredComponent workspace={workspace} ns={[ENTITY_PANE_COMPONENT_NS, "**"].join("/")} />
      </GutterComponent>
    </div>;
  }
}

// prop injection doesn't exist in the root application component, so render
export class RootComponent extends RootApplicationComponent {
  render() {
    return <EditorComponent />;
  }
}

