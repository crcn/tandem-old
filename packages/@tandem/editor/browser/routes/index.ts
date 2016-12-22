import { inject } from "@tandem/common";
import { EditorRouteNames } from "@tandem/editor/browser/constants";
import { EditorStoreProvider } from "@tandem/editor/browser/providers";
import { CreateNewProjectRequest } from "@tandem/editor/common";
import { BaseRouteHandler, EditorStore } from "@tandem/editor/browser/stores";
import { RedirectRequest, OpenWorkspaceRequest, GetProjectRequest } from "@tandem/editor/browser/messages";

/**
 * Create a new project immediately if the user loads root
 */

export class HomeRouteHandler extends BaseRouteHandler {

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;

  async load({ query }: RedirectRequest) {

    // anon? Create a new project immediately
    if (!this._store.user._id) {
      const project = await this._store.user.createProject();
      return {
        redirect: new RedirectRequest(`/workspace/${project._id}`)
      };
    } else {
      return {
        redirect:  new RedirectRequest(`/projects`)
      }
    }
  }
}

export class WorkspaceRouteHandler extends BaseRouteHandler {
  async load({ params }: RedirectRequest) {

    if (!window["$synthetic"]) {
      const project = await GetProjectRequest.dispatch(params.projectId, this.bus);
      await this.bus.dispatch(new OpenWorkspaceRequest(project));
    }

    return {
      state: {
        [EditorRouteNames.ROOT]: EditorRouteNames.WORKSPACE
      }
    };
  }
}
