import * as URL from "url";
import { TransformStream } from "@tandem/mesh";
import { OpenWorkspaceRequest } from "tandem-studio/common";
import { BaseStudioEditorBrowserCommand } from "./base";

export class QueryOpenWorkspaceCommand extends  BaseStudioEditorBrowserCommand {
  execute() {
    const { query } = URL.parse(window.location.toString(), true);

    // WS path here exists since the backend does a check - just open it here
    if (query.workspacePath) {
      return this.bus.dispatch(new OpenWorkspaceRequest(query.workspacePath));
    }
  }
}