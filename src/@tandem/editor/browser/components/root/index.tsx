import "./index.scss";

import * as React from "react";
import { Store } from "@tandem/editor/browser/models";
import CenterComponent from "./center";
import { StoreProvider } from "@tandem/editor/browser/providers";
import { GutterComponent } from "./gutter";
import { IActor, Injector, RootApplicationComponent, BaseApplicationComponent, inject } from "@tandem/common";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { DocumentPaneComponentFactoryProvider, EntityPaneComponentFactoryProvider } from "@tandem/editor/browser/providers";


export class EditorComponent extends BaseApplicationComponent<{}, {}> {

  @inject(StoreProvider.ID)
  private _store: Store;

  render() {
    const { workspace, settings } = this._store;

      // <GutterComponent style={{width:300}}>
      //   <RegisteredComponent workspace={workspace} ns={DocumentPaneComponentFactoryProvider.getId("**")} />
      // </GutterComponent>

    return <div className="m-editor editor">
      <CenterComponent />
      <GutterComponent style={{width:350}}>
        <RegisteredComponent workspace={workspace} ns={EntityPaneComponentFactoryProvider.getId("**")} />
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

