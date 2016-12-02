import { BaseRouteHandler } from "@tandem/editor/browser/stores";
import { RedirectRequest, OpenWorkspaceRequest } from "@tandem/editor/browser/messages";
import { RouteNames  } from "@tandem/editor/browser/constants";

export class WorkspaceRouteHandler extends BaseRouteHandler {
  async load({ query }: RedirectRequest) {

    await this.bus.dispatch(new OpenWorkspaceRequest(query.workspacePath));

    return {
      state: {
        [RouteNames.ROOT]: [RouteNames.WORKSPACE]
      }
    };
  }
}