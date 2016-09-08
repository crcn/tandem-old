import { IActor } from "tandem-common/actors";
import { IEntity } from "./entities/base";
import { WrapBus } from "mesh";
import { debounce } from "lodash";
import { Observable } from "tandem-common/observable";
import { IExpression } from "./base";
import { Dependencies } from "tandem-common/dependencies";
import { patchTreeNode } from "tandem-common/tree";
import { Action, PropertyChangeAction } from "tandem-common/actions";

export class EntityRuntime extends Observable {

  private _ast: IExpression;
  private _entity: IEntity;
  private _astObserver: IActor;
  private _entityObserver: IActor;

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

      // remove the expression observer for now so that the patching
      // does not trigger a save() below
      this._ast.unobserve(this._astObserver);

      // apply the changes to the current AST -- this will notify any entities
      // that also need to change
      patchTreeNode(this._ast, ast);

      this._ast.observe(this._astObserver);

      // since the entity tree is dirty at this point, we'll need to apply an update
      await this._entity.update();
    } else {
      this._ast = ast;

      this._ast.observe(this._astObserver);
      this._entity = this.createEntity(this._ast);
      this._entity.observe(this._entityObserver);
      this._entity.context = Object.assign(this.context, {
        dependencies: this._dependencies
      });
      await this._entity.load();

      // listen for any changes so that the rest of the application may reflect
      // changes onthe entity tree
      this.notify(new PropertyChangeAction("entity", this._entity, undefined));
    }
  }

  protected onASTAction(action: Action) {
    this._entity.update();
    this.notify(action);
  }

  protected onEntityAction(action: Action) {
    this.notify(action);
  }
}