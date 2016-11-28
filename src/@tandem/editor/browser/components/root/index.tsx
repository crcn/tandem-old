import "./index.scss";

import * as React from "react";
import { Store } from "@tandem/editor/browser/models";
import { SettingKeys } from "@tandem/editor/browser/constants";
import CenterComponent from "./center";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { GutterComponent } from "@tandem/uikit";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { DocumentPaneComponentFactoryProvider, EntityPaneComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { Injector, RootApplicationComponent, BaseApplicationComponent, inject } from "@tandem/common";

export class EditorComponent extends BaseApplicationComponent<{}, {}> {

  @inject(EditorStoreProvider.ID)
  private _store: Store;

  render() {
    const { workspace, settings } = this._store;
    const selection = workspace && workspace.selection || [];

    const hideLeftGutter = this._store.settings.get(SettingKeys.HIDE_LEFT_SIDEBAR);
    const hideRightGutter = this._store.settings.get(SettingKeys.HIDE_RIGHT_SIDEBAR);

    return <div className="m-editor editor">
      { hideLeftGutter ? null : <GutterComponent className="left" style={{width:350, display: "block" }}>
        <RegisteredComponent workspace={workspace} ns={DocumentPaneComponentFactoryProvider.getId("**")} />
      </GutterComponent> }
      <CenterComponent />
      { hideRightGutter ? null : <GutterComponent className="right" style={{width:350, display: "block"  }}>
        <RegisteredComponent workspace={workspace} ns={EntityPaneComponentFactoryProvider.getId("**")} />
      </GutterComponent> }
    </div>;
  }
}

// prop injection doesn't exist in the root application component, so render
export class RootComponent extends RootApplicationComponent {
  render() {
    return <EditorComponent />;
  }
}

