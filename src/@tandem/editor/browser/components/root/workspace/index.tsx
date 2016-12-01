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

export class WorkspaceComponent extends BaseApplicationComponent<{}, {}> {

  @inject(EditorStoreProvider.ID)
  private _store: Store;

  render() {
    const { workspace, settings } = this._store;
    const selection = workspace && workspace.selection || [];

    const hideLeftGutter = this._store.settings.get(SettingKeys.HIDE_LEFT_SIDEBAR);
    const hideRightGutter = this._store.settings.get(SettingKeys.HIDE_RIGHT_SIDEBAR);
    
    return <div className="td-workspace">
      { hideLeftGutter ? null : <GutterComponent className="left" style={{width:350, display: "block" }}>
        <RegisteredComponent workspace={workspace} ns={DocumentPaneComponentFactoryProvider.getId("**")} />
      </GutterComponent> }
      <CenterComponent workspace={workspace} />
      { hideRightGutter ? null : <GutterComponent className="right" style={{width:350, display: "block"  }}>
        <RegisteredComponent workspace={workspace} ns={EntityPaneComponentFactoryProvider.getId("**")} />
      </GutterComponent> }
    </div>;
  }
}
