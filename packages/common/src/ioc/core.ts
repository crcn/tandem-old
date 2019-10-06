import { FileAdapterProvider, MimeTypeProvider } from "../file";

export interface Provider {
  readonly id: string;
  initialize(kernel: Kernel);
}

export type ProviderClass = {
  ID: string;
};

export abstract class BaseInstanceProvider<TInstance> implements Provider {
  private _instance: TInstance;
  constructor(
    readonly id: string,
    private _createInstance: (kernel: Kernel) => TInstance
  ) {}
  get instance() {
    return this._instance;
  }
  initialize(kernel: Kernel) {
    this._instance = this._createInstance(kernel);
  }
}

export type KernelRegistry = {
  [identifier: string]: any;
};

export class Kernel {
  private _initialized: boolean;
  private _providers: KernelRegistry;
  constructor(providers: Provider[] = []) {
    this._providers = {};
    for (const provider of providers) {
      this._providers[provider.id] = provider;
    }
  }
  getProvider<TID extends string>(id: TID): Provider {
    return this._providers[id];
  }
  initialize() {
    if (this._initialized) {
      throw new Error(`Kernel already initialized`);
    }
    this._initialized = true;
    for (const id in this._providers) {
      this._providers[id].initialize(this);
    }
    return this;
  }
  concat(...kernels: Kernel[]) {
    return kernels.reduce((kernel, next) => {
      return new Kernel([
        ...Object.values(kernel._providers),
        ...Object.values(next._providers)
      ]);
    }, this);
  }
}

export const providerGetter = <TProvider extends Provider>(id: string) => (
  kernel: Kernel
) => kernel.getProvider(id) as TProvider;
