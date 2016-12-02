import { RouteFactoryProvider } from "@tandem/editor/browser/providers";
import { IMessage } from "@tandem/mesh";
import { 
  Injector, 
  inject, 
  InjectorProvider, 
  PropertyMutation, 
  Observable, 
  bindable, 
  PropertyWatcher 
} from "@tandem/common";

export interface IRouterState {
  [Identifier: string]: string
}

export interface IRoute {
  load(): Promise<IRouterState>;
}

export class Router extends Observable {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  private _state: IRouterState = {};
  private _currentRoute: IRoute;
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

  async redirect(path: string) {
    const routeProvider = RouteFactoryProvider.findByPath(path, this._injector);
    if (!routeProvider) throw new Error(`Route ${path} does not exist`);
    
    const route = routeProvider.create();

    this.setState(path, await route.load() || {});
  }
}

export const createStatedRouteClass = (state: IRouterState): { new(): IRoute } => {
  return class implements IRoute {
    load() {

      // protect state against any mutations
      return Promise.resolve(Object.assign({}, state)); 
    }
  }
}