import "./index.scss";

import * as React from "react";
import EditorCommponent from "./editor";
import { RegisteredComponent } from "@tandem/editor/browser/components/common";
import { inject, BaseApplicationComponent } from "@tandem/common";

import { Store } from "@tandem/editor/browser/models";
import { StoreDependency } from "@tandem/editor/browser/dependencies";

export default class CenterComponent extends BaseApplicationComponent<{}, {}> {

  @inject(StoreDependency.ID)
  private _store: Store;

  render() {
    const { workspace } = this._store;
    if (!workspace) return null;
    return <EditorCommponent workspace={workspace} allElements={workspace.documentQuerier.queriedElements || []}  />
  }
}
