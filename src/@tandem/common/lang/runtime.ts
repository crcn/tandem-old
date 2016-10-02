import { IActor } from "@tandem/common/actors";
import { IEntity } from "./entities/base";
import { WrapBus } from "mesh";
import { debounce } from "lodash";
import { Observable } from "@tandem/common/observable";
import { IASTNode } from "./base";
import { EntityAction } from "@tandem/common/actions";
import { patchTreeNode } from "@tandem/common/tree";
import { Action, PropertyChangeAction, EntityRuntimeAction } from "@tandem/common/actions";

export class EntityRuntime extends Observable {

  private _ast: IASTNode;
  private _entity: IEntity;
  private _astObserver: IActor;
  private _entityObserver: IActor;
  private _evaluating: boolean;
  private _shouldEvaluateAgain: boolean;

  constructor(private _createRootEntity: (ast: IASTNode) => IEntity, private _getContext?: () => any) {
    super();
    this._astObserver    = new WrapBus(this.onASTAction.bind(this));
    this._entityObserver = new WrapBus(this.onEntityAction.bind(this));
    if (!this._getContext) {
      this._getContext = () => {};
    }
  }

  get entity(): IEntity {
    return this._entity;
  }

  async load(ast: IASTNode) {

    if (this._ast) {
      this._ast.unobserve(this._astObserver);
    }

    this._ast = ast;

    this._ast.observe(this._astObserver);
    this._entity = this._createRootEntity(this._ast);
    this._entity.observe(this._entityObserver);

    // listen for any changes so that the rest of the application may reflect
    // changes onthe entity tree
    this.notify(new PropertyChangeAction("entity", this._entity, undefined));

    await this.evaluate();
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
      await this._entity.evaluate(this._getContext() || {});
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