import { BaseRouteHandler } from "@tandem/editor/browser/stores";
import { RedirectRequest, OpenWorkspaceRequest } from "@tandem/editor/browser/messages";
import { EditorRouteNames  } from "@tandem/editor/browser/constants";

export class WorkspaceRouteHandler extends BaseRouteHandler {
  async load({ query }: RedirectRequest) {

    await this.bus.dispatch(new OpenWorkspaceRequest(query.workspacePath));

    return {
      state: {
        [EditorRouteNames.ROOT]: EditorRouteNames.WORKSPACE
      }
    };
  }
}