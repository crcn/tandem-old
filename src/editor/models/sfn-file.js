import { FactoryFragment } from 'common/fragments';
import CoreObject from 'common/object';
import XMLParser from 'common/parsers/xml.peg';
import observable from 'common/object/mixins/observable';

@observable
export default class SfnFile extends CoreObject {
  async load() {
    var rootExpression = XMLParser.parse(this.content);
    var entity = await rootExpression.execute({
      bus: this.bus,
      fragments: this.isolate !== false ? this.fragments.createChild() : this.fragments
    });

    this.setProperties({
      entity
    });
  }
}

export const fragment = FactoryFragment.create({
  ns: 'models/sfn-file',
  factory: SfnFile,
});
