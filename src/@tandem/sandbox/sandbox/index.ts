import * as vm from "vm";
import { WrapBus } from "mesh";
import { SandboxModuleEvaluatorFactoryProvider } from "./providers";

import {
  Dependency,
  DependencyGraph,
  DependencyAction
} from "@tandem/sandbox/dependency-graph";

import {
  IActor,
  Action,
  inject,
  loggable,
  Logger,
  Observable,
  IObservable,
  Injector,
  PropertyChangeAction,
} from "@tandem/common";

export type sandboxDependencyEvaluatorType = { new(): ISandboxDependencyEvaluator };
export interface ISandboxDependencyEvaluator {
  evaluate(module: SandboxModule): void;
}

export interface IModule {
  exports: any;
  source: Dependency;
}

export class SandboxModule implements IModule {
  public exports: any;
  constructor(readonly sandbox: Sandbox, readonly source: Dependency) {
    this.exports = {};
  }

  get filePath() {
    return this.source.filePath;
  }
}

/**
 * TODO - consider removing require() statement and using evaluate(bundle) instead
 */

@loggable()
export class Sandbox extends Observable {

  protected readonly logger: Logger;

  private _modules: any;
  private _entry: Dependency;
  private _paused: boolean;
  private _mainModule: any;
  private _entryObserver: IActor;
  private _shouldEvaluate: boolean;
  private _waitingForAllLoaded: boolean;

  private _global: any;
  private _context: vm.Context;
  private _exports: any;

  constructor(private _injector: Injector, private createGlobal: () => any = () => {}) {
    super();

    // for logging
    this._injector.inject(this);
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

  get vmContext(): vm.Context {
    return this._context;
  }

  get exports(): any {
    return this._exports;
  }

  get global(): any {
    return this._global;
  }

  get entry(): Dependency {
    return this._entry;
  }

  async open(entry: Dependency) {

    if (this._entry) {
      this._entry.unobserve(this._entryObserver);
    }
    this._entry = entry;
    this._entry.observe(this._entryObserver);

    this._entry.load();
    await this._entry.whenAllLoaded();
    this.reset();
  }

  public evaluate(dependency: Dependency): Object {
    const hash = dependency.hash;

    if (this._modules[dependency.hash]) {
      return this._modules[dependency.hash].exports;
    }

    if (!dependency.loaded) {
      throw new Error(`Attempting to evaluate dependency ${hash} that is not loaded yet.`);
    }

    const module = this._modules[hash] = new SandboxModule(this, dependency);

    // TODO - cache evaluator here
    const evaluatorFactoryDepedency = SandboxModuleEvaluatorFactoryProvider.find(dependency.type, this._injector);

    if (!evaluatorFactoryDepedency) {
      throw new Error(`Cannot evaluate ${dependency.filePath}:${dependency.type} in sandbox.`);
    }

    this.logger.verbose("Evaluating %s", dependency.filePath);
    evaluatorFactoryDepedency.create().evaluate(module);

    return this.evaluate(dependency);
  }

  protected async onEntryAction(action: Action) {

    if (action.type === DependencyAction.DEPENDENCY_LOADED) {

      // Multiple deps may have changed, so wait to ensure that everything's loaded
      // before re-evaluating the sandbox
      if (this._waitingForAllLoaded) return;

      this._waitingForAllLoaded = true;
      this.logger.verbose("Received dependency update, waiting for others to finish loading")
      try {
        await this._entry.whenAllLoaded();
      } catch(e) {
        this._waitingForAllLoaded = false;
        throw e;
      }
      this._waitingForAllLoaded = false;

      if (this._paused) {
        this._shouldEvaluate = true;
        return;
      }

      this.logger.verbose(`Re-evaluating entry ${this._entry.filePath}`);

      // TODO - wait for all children to be ready
      this.reset();
    }
  }

  private reset() {
    const logTimer = this.logger.startTimer();
    this._shouldEvaluate = false;
    const exports = this._exports;
    const global  = this._global;

    // global may have some clean up to do (timers, open connections),
    // so call dispose if the method is available.
    if (global && global.dispose) global.dispose();

    this._global  = this.createGlobal() || {};
    this._context = vm.createContext(this._global);
    this.notify(new PropertyChangeAction("global", this._global, global));
    this._modules = {};
    this._exports = this.evaluate(this._entry);
    logTimer.stop(`Evaluated ${this._entry.filePath}`);
    this.notify(new PropertyChangeAction("exports", this._exports, exports));
  }
}

export * from "./providers";