import CoreObject from 'saffron-common/src/object/index';
import Runtime from '../runtime/index'
import observable from 'saffron-common/src/decorators/observable';
import FragmentDict from 'saffron-common/src/fragments/collection';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import { Bus } from 'mesh';
import { applyDiff as patch } from 'deep-diff';
import Entity from 'saffron-front-end/src/entities/base';

@observable
export default class SfnFile extends CoreObject {

  public content:string;
  public expression:Object;
  public bus:Bus;
  public entity:any;
  public app:any;
  public isolate:boolean;
  public fragments:FragmentDict;
  private _runtime:Runtime = new Runtime();

  /**
   */ 

  async load() {
    await this._runtime.load(this.content);

    // var options = {
    //   bus: this.bus,
    //   file: this,
    //   app: this.app,
    //   fragments: this.isolate !== false ? this.fragments.createChild() : this.fragments
    // };

      // patch(this.expression, expression, undefined);
      // this.entity.update(options);
    
    
    this.setProperties({
      entity: this._runtime.entity
    });
  }

  /**
   */

  async save() {
    console.log('save saffron file');
  }
}

export const fragment = new ClassFactoryFragment('models/sfn-file', SfnFile);