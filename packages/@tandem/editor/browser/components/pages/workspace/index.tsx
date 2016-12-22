import "./index.scss";

import React =  require("react");
import { WorkspaceMidComponent } from "./mid";
import { WorkspaceTitlebarComponent } from "./titlebar";
import { BaseApplicationComponent } from "@tandem/common";
import { RegisteredComponent  } from "@tandem/editor/browser/components/common";
import { EditorComponentFactoryProvider } from "@tandem/editor/browser/providers";

export class WorkspaceComponent extends BaseApplicationComponent<{}, {}> {
  render() {
    return <div className="td-workspace">
      <div className="editors">
        { this.kernel.queryAll<EditorComponentFactoryProvider>(EditorComponentFactoryProvider.getId("**")).map((provider, i) => {
          return provider.create({ ...this.props, key: i });
        })}
        <div className="visual-editor">
          <WorkspaceTitlebarComponent />
          <WorkspaceMidComponent />
        </div>
      </div>
    </div>;
  }
}
