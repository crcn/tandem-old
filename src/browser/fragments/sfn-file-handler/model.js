import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import XMLParser from 'common/parsers/xml.peg';
import sift from 'sift';

@observable
export default class SfnFile extends CoreObject {
  constructor(properties) {
    super(properties);
    this.load();
  }

  async load() {
    var expression = XMLParser.parse(this.content);

    var entity = await expression.execute({
      bus: this.bus,
      file: this,
      fragmentDictionary: this.isolate ? this.fragmentDictionary.createChild() : this.fragmentDictionary
    });

    this.setProperties({
      expression: expression,
      entity    : entity,
    });
  }

  didChange(changes) {
    var contentChange = changes.find(sift({ property: 'content' }));

    if (contentChange) {
      this.load();
    }
  }
}
