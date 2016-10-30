import "./index.scss";

import * as React from "react";
import EditorCommponent from "./editor";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { inject, BaseApplicationComponent } from "@tandem/common";

import { Store } from "@tandem/editor/browser/models";
import { StoreProvider } from "@tandem/editor/browser/providers";

export default class CenterComponent extends BaseApplicationComponent<{}, {}> {

  @inject(StoreProvider.ID)
  private _store: Store;

  render() {
    const { workspace } = this._store;
    if (!workspace) return null;
    return <EditorCommponent workspace={workspace} />
  }
}
