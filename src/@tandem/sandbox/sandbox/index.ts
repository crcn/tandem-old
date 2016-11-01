import { WrapBus } from "mesh";
import {
  Dependency,
  DependencyGraph,
  DependencyAction
} from "@tandem/sandbox/dependency-graph";
import { SandboxModuleEvaluatorFactoryProvider, DependencyGraphProvider } from "../providers";
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

export type sandboxBundleEvaluatorType = { new(): ISandboxBundleEvaluator };
export interface ISandboxBundleEvaluator {
  evaluate(module: SandboxModule): void;
}

export class SandboxModule {
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

  private _global: any;
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

  get exports(): any {
    return this._exports;
  }

  get global(): any {
    return this._global;
  }

  async open(entry: Dependency) {

    if (this._entry) {
      this._entry.unobserve(this._entryObserver);
    }
    this._entry = entry;
    this._entry.observe(this._entryObserver);

    this.logger.verbose("wait for %s", entry.filePath);
    await this._entry.whenReady();
    this.reset();
  }

  public evaluate(dependency: Dependency): Object {

    const hash = dependency.hash;

    if (this._modules[dependency.hash]) {
      return this._modules[dependency.hash].exports;
    }

    if (!dependency.ready) {
      throw new Error(`Trying to require dependency ${hash} that is not ready yet.`);
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

  protected onEntryAction(action: Action) {
    if (action.type === DependencyAction.DEPENDENCY_READY) {
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
    this._exports = this.evaluate(this._entry);
    this.notify(new PropertyChangeAction("exports", this._exports, exports));
  }
}
