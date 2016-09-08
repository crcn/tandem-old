import { IActor } from "tandem-common/actors";
import { Action } from "tandem-common/actions";
import { WrapBus } from "mesh";
import { TreeNode } from "tandem-common/tree";

export class Entity {

}

export class EntityRuntine {
  private _source: TreeNode<any>;
  private _sourceObserver: IActor;

  load(source: TreeNode<any>) {
    this._source = source;
    // this._sourceObserver = new WrapBus(this.onSourceChange.bind(this));
  }

  onSourceChange(action: Action) {

  }
}