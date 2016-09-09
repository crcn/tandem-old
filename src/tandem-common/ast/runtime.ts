import { IActor } from "tandem-common/actors";
import { IEntity } from "./entities/base";
import { WrapBus } from "mesh";
import { debounce } from "lodash";
import { Observable } from "tandem-common/observable";
import { IExpression } from "./base";
import { EntityAction } from "tandem-common/actions";
import { Dependencies } from "tandem-common/dependencies";
import { patchTreeNode } from "tandem-common/tree";
import { Action, PropertyChangeAction, EntityRuntimeAction } from "tandem-common/actions";

export class EntityRuntime extends Observable {

  private _ast: IExpression;
  private _entity: IEntity;
  private _astObserver: IActor;
  private _entityObserver: IActor;
  private _evaluating: boolean;
  private _shouldEvaluateAgain: boolean;

  constructor(public context: any = {}, private _dependencies: Dependencies, readonly createEntity: (ast: IExpression) => IEntity) {
    super();
    this._astObserver = new WrapBus(this.onASTAction.bind(this));
    this._entityObserver = new WrapBus(this.onEntityAction.bind(this));
  }

  get entity(): IEntity {
    return this._entity;
  }

  async load(ast: IExpression) {

    if (this._ast) {
      this._ast.unobserve(this._astObserver);
    }

    this._ast = ast;

    this._ast.observe(this._astObserver);
    this._entity = this.createEntity(this._ast);
    this._entity.observe(this._entityObserver);

    // listen for any changes so that the rest of the application may reflect
    // changes onthe entity tree
    this.notify(new PropertyChangeAction("entity", this._entity, undefined));

    await this.evaluate();
  }

  protected createContext() {
    return Object.assign(this.context, {
      dependencies: this._dependencies.clone()
    });
  }

  protected onASTAction(action: Action) {
    this.deferEvaluate();
    this.notify(action);
  }

  protected onEntityAction(action: Action) {

    // entities may contain separate, isolated runtimes. Capture events from them and re-evaluate
    // to ensure that all other entities are in sync
    if (action.type === EntityRuntimeAction.RUNTIME_EVALUATED && !this._evaluating) {
      this.deferEvaluate();
    }

    this.notify(action);
  }

  private async evaluate() {

    if (this._evaluating) {
      return new Promise((resolve, reject) => {
        const observer = new WrapBus((action: Action) => {
          if (action.type === EntityRuntimeAction.RUNTIME_EVALUATED) {
            this.unobserve(observer);
            resolve();
          }
        });
        this.observe(observer);
      });
    }

    this._evaluating = true;
    try {
      await this._entity.evaluate(this.createContext());
    } catch (e) {
      console.error(e.stack);
    }
    this._evaluating = false;
    this.notify(new EntityRuntimeAction(EntityRuntimeAction.RUNTIME_EVALUATED));
  }

  private deferEvaluate = debounce(() => {
    this.evaluate();
  }, process.env.TESTING ? 1 : 50);
}