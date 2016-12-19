import { SocketIOBus, filterFamilyMessage } from "@tandem/mesh";
import createSocketIOClient = require("socket.io-client");
import { BaseRouteHandler } from "@tandem/editor/browser/stores";
import { EditorRouteNames } from "@tandem/editor/browser/constants";
import { RemoteSyntheticBrowser } from "@tandem/synthetic-browser";
import { CreateNewProjectRequest, GetProjectRequest } from "tandem-playground/common";
import { IPlaygroundBrowserConfig } from "tandem-playground/browser/config";
import { RedirectRequest, OpenWorkspaceRequest } from "@tandem/editor/browser/messages";
import { inject, ApplicationConfigurationProvider, serialize, deserialize } from "@tandem/common";
import { Workspace, EditorStoreProvider, EditorStore,  } from "@tandem/editor/browser";

export class HomeRouteHandler extends BaseRouteHandler {

  @inject(EditorStoreProvider.ID)
  private _store: EditorStore;


  async load({ query }: RedirectRequest) {

    const project = await CreateNewProjectRequest.dispatch(this.bus);



    // await OpenWorkspaceRequest.dispatch(this._config.server.href + "/projects/" + project._id + ".tandem", this.bus);

  
    return {
      redirect: new RedirectRequest(`/workspace/${project._id}`)
    };
  }
}

export class ProjectRouteHandler extends BaseRouteHandler {

  @inject(ApplicationConfigurationProvider.ID)
  private _config: IPlaygroundBrowserConfig;

  async load({ query, params }: RedirectRequest) {

    const project = await GetProjectRequest.dispatch(params.id, this.bus);

    const connection = createSocketIOClient(project.host);

    const bus = new SocketIOBus({
      family: this._config.family,
      connection: connection as any,
      testMessage: filterFamilyMessage
    }, this.bus, { serialize, deserialize });
    this.bus.register(bus);


    await OpenWorkspaceRequest.dispatch(this._config.server.href + "/projects/" + params.id + ".tandem", this.bus);

    return {
      state: {
        [EditorRouteNames.ROOT]: EditorRouteNames.WORKSPACE
      }
    };
  }
}