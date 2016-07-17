import CoreObject from 'common/object';
import XMLParser from 'common/parsers/xml.peg';
import observable from 'common/object/mixins/observable';
import { FactoryFragment } from 'common/fragments';
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
}

export const fragment = FactoryFragment.create({
  ns: 'models/sfn-file',
  factory: SfnFile
});
