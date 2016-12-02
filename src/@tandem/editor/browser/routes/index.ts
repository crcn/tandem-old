import { BaseRouteHandler } from "@tandem/editor/browser/stores";
import { RedirectRequest, OpenWorkspaceRequest } from "@tandem/editor/browser/messages";
import { RouteNames  } from "@tandem/editor/browser/constants";

export class WorkspaceRouteHandler extends BaseRouteHandler {
  async load({ query }: RedirectRequest) {
    
    // for desktop -- this may get ignored in the browser 
    const width = 1024;
    const height = 768;
    window.resizeTo(width, height);
    window.moveTo(window.screen.width / 2 - width / 2, window.screen.height / 2 - height / 2);

    await this.bus.dispatch(new OpenWorkspaceRequest(query.workspacePath));

    return {
      state: {
        [RouteNames.ROOT]: [RouteNames.WORKSPACE]
      }
    };
  }
}