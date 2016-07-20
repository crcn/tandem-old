import CoreObject from 'saffron-common/lib/object/index';
import { parse as parseXML } from 'saffron-common/src/parsers/xml.peg';
import observable from 'saffron-common/lib/decorators/observable';
import FragmentDict from 'saffron-common/lib/fragments/collection';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import { Bus } from 'mesh';
import { applyDiff as patch } from 'deep-diff';
import Entity from 'saffron-common/lib/entities/entity';

@observable
export default class SfnFile extends CoreObject {

  public content:string;
  public expression:Object;
  public bus:Bus;
  public entity:Entity;
  public app:any;
  public isolate:boolean;
  public fragments:FragmentDict;

  /**
   */ 

  async load() {
    var expression = parseXML(this.content);

    var options = {
      bus: this.bus,
      file: this,
      app: this.app,
      fragments: this.isolate !== false ? this.fragments.createChild() : this.fragments
    };

    // don't do this for now.
    if (this.expression && false) {
      patch(this.expression, expression, undefined);
      this.entity.update(options);
    } else {
      this.expression = expression;
      var entity = await expression.load(options);
      
      this.setProperties({
        expression,
        entity
      });
    }
  }

  /**
   */

  async save() {
    console.log('save saffron file');
  }
}

export const fragment = new ClassFactoryFragment('models/sfn-file', SfnFile);