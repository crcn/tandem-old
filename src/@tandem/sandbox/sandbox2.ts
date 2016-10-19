import { WrapBus } from "mesh";
import { BundleAction } from "./actions";
import { Bundle, Bundler } from "./bundle";
import { SandboxModuleEvaluatorFactoryDependency, BundlerDependency } from "./dependencies";
import { IActor, Action, Dependencies, PropertyChangeAction, Observable } from "@tandem/common";

export type sandboxBundleEvaluatorType = { new(): ISandboxBundleEvaluator };
export interface ISandboxBundleEvaluator {
  evaluate(module: Sandbox2Module): void;
}

export class Sandbox2Module {
  public exports: any;
  constructor(readonly sandbox: Sandbox2, readonly bundle: Bundle) {
    this.exports = {};
  }
}

export class Sandbox2 extends Observable {
  private _modules: any;
  private _entry: Bundle;
  private _mainModule: any;
  private _entryObserver: IActor;
  private _bundler: Bundler;
  private _global: any;
  private _exports: any;

  constructor(private _dependencies: Dependencies, private createGlobal: () => any = () => {}) {
    super();
    this._entryObserver = new WrapBus(this.onEntryAction.bind(this));
    this._modules = {};
    this._bundler = BundlerDependency.getInstance(_dependencies);
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

    if (this._entry.ready) {
      this.evaluate();
    }
  }

  require(filePath: string): Object {
    if (this._modules[filePath]) {
      return this._modules[filePath].exports;
    }

    const bundle = this._bundler.collection.findByUid(filePath);

    if (!bundle) {
      throw new Error(`${filePath} does not exist in the ${this._entry.filePath} bundle.`);
    }

    const module = this._modules[filePath] = new Sandbox2Module(this, bundle);

    // TODO - cache evaluator here
    const evaluatorFactoryDepedency = SandboxModuleEvaluatorFactoryDependency.find(null, bundle.content.type, this._dependencies);

    if (!evaluatorFactoryDepedency) {
      throw new Error(`Cannot evaluate ${filePath} in sandbox.`);
    }

    evaluatorFactoryDepedency.create().evaluate(module);
    return this.require(filePath);
  }

  protected onEntryAction(action: Action) {
    if (action.type === BundleAction.BUNDLE_READY) {
      this.evaluate();
    }
  }

  private evaluate() {
    const exports = this._exports;
    this._global  = this.createGlobal();
    this._modules = {};
    this._exports = this.require(this._entry.filePath);
    this.notify(new PropertyChangeAction("exports", this._exports, exports));
  }
}