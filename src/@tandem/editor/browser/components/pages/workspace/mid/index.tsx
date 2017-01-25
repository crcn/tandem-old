import "./index.scss";

import React =  require("react");
import { EditorStore } from "@tandem/editor/browser/stores";
import { SettingKeys } from "@tandem/editor/browser/constants";
import CenterComponent from "./center";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { GutterComponent } from "@tandem/uikit";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { DocumentPaneComponentFactoryProvider, EntityPaneComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { Kernel, RootApplicationComponent, BaseApplicationComponent, inject } from "@tandem/common";

export class WorkspaceMidComponent extends BaseApplicationComponent<{}, {}> {

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

  render() {
    const { workspace, settings } = this._store;
    const selection = workspace && workspace.selection || [];

    const hideLeftGutter   = this._store.settings.get(SettingKeys.HIDE_LEFT_SIDEBAR);
    const hideRightGutter  = this._store.settings.get(SettingKeys.HIDE_RIGHT_SIDEBAR);
    const hideBottomGutter = this._store.settings.get(SettingKeys.HIDE_BOTTOM_GUTTER);
    
    return <div className="td-workspace-mid">
      { hideLeftGutter ? null : <GutterComponent className="left" style={{width:350, display: "block" }}>
        <RegisteredComponent workspace={workspace} ns={DocumentPaneComponentFactoryProvider.getId("**")} />
      </GutterComponent> }
      <div className="td-workspace-mid-cent">
        <CenterComponent workspace={workspace} />
        { hideBottomGutter ? null : <GutterComponent className="bottom" style={{ height: 350, display: "block" }}>
          <div> GUTTERRR </div>
        </GutterComponent>}
      </div>
      { hideRightGutter ? null : <GutterComponent className="right" style={{width:350, display: "block"  }}>
        <RegisteredComponent workspace={workspace} ns={EntityPaneComponentFactoryProvider.getId("**")} />
      </GutterComponent> }
    </div>;
  }
}
