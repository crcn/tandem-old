import { BaseRouteHandler } from "@tandem/editor/browser/stores";
import { RedirectRequest } from "@tandem/editor/browser/messages";
import { RouteNames } from "@tandem/editor/browser/constants";
import { StudioRouteNames } from "../constants";

export class WelcomeRouteHandler extends BaseRouteHandler {
  async load(request: RedirectRequest) {
    return {
      state: {
        [RouteNames.ROOT]: StudioRouteNames.WELCOME
      }
    };
  }
}