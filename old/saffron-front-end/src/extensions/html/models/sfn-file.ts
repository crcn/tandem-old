import {
  IActor,
  IApplication,
  CoreObject,
  observable,
  ClassFactoryFragment,
  UpdateAction
} from 'sf-common/index';

import Runtime from '../runtime/index'
import Entity from 'sf-front-end/entities/base';
import { HTMLAttributeExpression, StringExpression } from '../runtime/expressions/index';

@observable
export default class SfnFile extends CoreObject {

  public entity:any;
  public ext:string;
  public content:string;
  public app:IApplication;
  public bus:IActor;
  public path:string;
  public collectionName:string;
  private _runtime:Runtime = new Runtime();

  /**
   */

  async load() {
    if (this.content === this._runtime.source) return;
    await this._runtime.load(this.content);
    this.setProperties({
      entity: this._runtime.entity
    });
  }

  /**
   */

  async save() {
    await this.bus.execute(new UpdateAction(this.collectionName, {
      content: this.content = this._runtime.entity.expression.toString(),
      ext: this.ext,
      path: this.path
    }, {
      path: this.path
    }))
  }
}

export const fragment = new ClassFactoryFragment('models/sfn-file', SfnFile);