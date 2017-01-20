import { BaseRouteHandler } from "@tandem/editor/browser/stores";
import { RedirectRequest } from "@tandem/editor/browser/messages";
import { EditorRouteNames } from "@tandem/editor/browser/constants";
import { StudioRouteNames } from "../constants";

export class WelcomeRouteHandler extends BaseRouteHandler {
  async load(request: RedirectRequest) {
    return {
      state: {
        [EditorRouteNames.ROOT]: StudioRouteNames.WELCOME
      }
    };
  }
}

export class GetStartedRouteHandler extends BaseRouteHandler {
  async load(request: RedirectRequest) {
    return {
      state: {
        [EditorRouteNames.ROOT]: StudioRouteNames.GET_STARTED
      }
    };
  }
}