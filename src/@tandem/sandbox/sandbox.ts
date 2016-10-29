import { WrapBus } from "mesh";
import { BundleAction } from "./actions";
import { Bundle, Bundler } from "./bundle";
import { SandboxModuleEvaluatorFactoryDependency, BundlerDependency } from "./dependencies";
import {
  IActor,
  Action,
  inject,
  loggable,
  Logger,
  Injector,
  Observable,
  IObservable,
  Dependencies,
  PropertyChangeAction,
} from "@tandem/common";

export type sandboxBundleEvaluatorType = { new(): ISandboxBundleEvaluator };
export interface ISandboxBundleEvaluator {
  evaluate(module: SandboxModule): void;
}

export class SandboxModule {
  public exports: any;
  constructor(readonly sandbox: Sandbox, readonly bundle: Bundle) {
    this.exports = {};
  }

  get filePath() {
    return this.bundle.filePath;
  }
}

/**
 * TODO - consider removing require() statement and using evaluate(bundle) instead
 */

@loggable()
export class Sandbox extends Observable {

  protected readonly logger: Logger;

  private _modules: any;
  private _entry: Bundle;
  private _paused: boolean;
  private _mainModule: any;
  private _entryObserver: IActor;
  private _shouldEvaluate: boolean;

  private _global: any;
  private _exports: any;

  constructor(private _dependencies: Dependencies, private createGlobal: () => any = () => {}) {
    super();
    Injector.inject(this, _dependencies);
    this._entryObserver = new WrapBus(this.onEntryAction.bind(this));
    this._modules = {};
  }

  public pause() {
    this._paused = true;
  }

  public resume() {
    this._paused = false;
    if (this._shouldEvaluate) {
      this.reset();
    }
  }

  get exports(): any {
    return this._exports;
  }

  get global(): any {
    return this._global;
  }

  async open(bundle: Bundle) {

    if (this._entry) {
      this._entry.unobserve(this._entryObserver);
    }
    this._entry = bundle;
    this._entry.observe(this._entryObserver);

    this.logger.verbose("wait for %s", bundle.filePath);
    await this._entry.whenReady();
    this.reset();

  }

  get ready() {
    return this._entry.ready;
  }

  require(hash: string, interpretableName?: string): Object {
    if (this._modules[hash]) {
      return this._modules[hash].exports;
    }

    const bundle = this._entry.bundler.eagerFindByHash(hash);

    if (!bundle) {
      throw new Error(`${hash} does not exist in the ${this._entry.filePath} bundle.`);
    }

    if (!bundle.ready) {
      throw new Error(`Trying to require bundle ${hash} that is not ready yet.`);
    }

    const module = this._modules[hash] = new SandboxModule(this, bundle);
    const now = Date.now();

    // TODO - cache evaluator here
    const evaluatorFactoryDepedency = SandboxModuleEvaluatorFactoryDependency.find(bundle.type, this._dependencies);

    if (!evaluatorFactoryDepedency) {
      throw new Error(`Cannot evaluate ${bundle.filePath}:${bundle.type} in sandbox.`);
    }

    this.logger.verbose("evaluating %s", bundle.filePath);
    evaluatorFactoryDepedency.create().evaluate(module);

    return this.require(hash, interpretableName);
  }

  protected onEntryAction(action: Action) {
    if (action.type === BundleAction.BUNDLE_READY) {
      if (this._paused) {
        this._shouldEvaluate = true;
        return;
      }
      this.reset();
    }
  }

  private reset() {
    this.logger.verbose("evaluate");
    this._shouldEvaluate = false;
    const exports = this._exports;
    const global  = this._global;
    this._global  = this.createGlobal();
    this.notify(new PropertyChangeAction("global", this._global, global));
    this._modules = {};
    this._exports = this.require(this._entry.hash, this._entry.filePath);
    this.notify(new PropertyChangeAction("exports", this._exports, exports));
  }
}
