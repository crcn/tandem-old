import { Kernel, BaseInstanceProvider, providerGetter } from "../ioc";
import { Store } from "redux";

export class ReduxProvider extends BaseInstanceProvider<Store> {
  static readonly ID = "ReduxProvider";
  constructor(createStore: (kernel: Kernel) => Store<any>) {
    super(ReduxProvider.ID, createStore);
  }
  static getProvider = providerGetter<ReduxProvider>(ReduxProvider.ID);
}

export class InitialStateProvider<TState> extends BaseInstanceProvider<TState> {
  static readonly ID = "InitialStateProvider";
  constructor(initialState: TState) {
    super(InitialStateProvider.ID, () => initialState);
  }
  static getProvider = providerGetter<InitialStateProvider<any>>(
    InitialStateProvider.ID
  );
}
