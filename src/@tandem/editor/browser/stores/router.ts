import qs =  require("qs");

import { RouteFactoryProvider } from "@tandem/editor/browser/providers";
import { RedirectRequest, DidRedirectMessage } from "@tandem/editor/browser/messages";
import { IMessage } from "@tandem/mesh";
import { 
  Injector, 
  inject, 
  bindable, 
  Observable, 
  PropertyMutation, 
  InjectorProvider, 
  PropertyWatcher,
  IBrokerBus,
  PrivateBusProvider,
} from "@tandem/common";

export interface IRouterState {
  [Identifier: string]: string
}

export interface IRouteHandlerLoadResult {
  redirect?: RedirectRequest;
  state?: IRouterState;
}


export interface IRouteHandler {
  load(request: RedirectRequest): Promise<IRouteHandlerLoadResult>;
}

export abstract class BaseRouteHandler implements IRouteHandler {
  @inject(PrivateBusProvider.ID)
  protected bus: IBrokerBus;
  abstract load(request: RedirectRequest): Promise<IRouteHandlerLoadResult>;
}

export class Router extends Observable {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  private _state: IRouterState = {};
  private _path: string;

  readonly stateWatcher: PropertyWatcher<Router, IRouterState>;
  readonly currentPathWatcher: PropertyWatcher<Router, string>;

  constructor() {
    super();
    this.stateWatcher = new PropertyWatcher<Router, IRouterState>(this, "state");
    this.currentPathWatcher = new PropertyWatcher<Router, string>(this, "currentPath");
  }

  get state() {
    return this._state;
  }

  get currentPath() {
    return this._path;
  }

  private setState(path: string, state: any) {
    const oldState = this._state;
    const oldPath  = this._path;
    this._state = state;
    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "state", state, oldState).toEvent());
    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "currentPath", path, oldPath).toEvent());
  }

  async redirect(request: RedirectRequest) {

    // do nothing with params for now

    let path: string = request.routeNameOrPath;

    const routeProvider = RouteFactoryProvider.findByPath(request.routeNameOrPath, this._injector);
    if (!routeProvider) throw new Error(`Route ${request.routeNameOrPath} does not exist`);
    
    const route = routeProvider.create();

    if (request.query) path += "?" + qs.stringify(request.query);

    const result = await route.load(request);

    this.setState(path, result.state);

    this._bus.dispatch(new DidRedirectMessage(path, result.state)); 
  }
}
