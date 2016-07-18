import CoreObject from 'saffron-common/object';
import XMLParser from 'saffron-common/parsers/xml.peg';
import observable from 'saffron-common/object/mixins/observable';
import { FactoryFragment } from 'saffron-common/fragments';
import { applyDiff as patch } from 'deep-diff';

@observable
export default class SfnFile extends CoreObject {

  /**
   */ 

  async load() {
    var expression = XMLParser.parse(this.content);

    var options = {
      bus: this.bus,
      file: this,
      app: this.app,
      fragments: this.isolate !== false ? this.fragments.createChild() : this.fragments
    };

    // don't do this for now.
    if (this.expression && false) {
      patch(this.expression, expression);
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

export const fragment = FactoryFragment.create({
  ns: 'models/sfn-file',
  factory: SfnFile
});
