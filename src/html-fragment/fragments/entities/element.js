import Entity from 'common/entities/entity';
import NodeSection from 'common/section/node';
import FragmentSection from 'common/section/fragment';
import { FactoryFragment } from 'common/fragments';
import GroupPreview from './preview/group';
import NodePreview from './preview/node';

class ElementEntity extends Entity {
  constructor(properties) {
    super({
      ...properties,
      type: 'display'
    });

    this.context = {};
  }
  async execute(options) {
    var controllerFragment = options.fragmentDictionary.query(`entity/controllers/${this.expression.nodeName}`);
    var ref;
    var section;
    var executeRef;
    var context = this.context;

    var attributes = {};

    for (var { key, value } of this.expression.attributes) {
      attributes[key] = (await value.execute(options)).value;
    }

    Object.assign(context, options.context || {}, context, attributes);

    if (controllerFragment) {
      this.preview = new GroupPreview(this);
      section = FragmentSection.create();
      ref = controllerFragment.create({
        ...options,
        section: section,
        attributes: attributes,
        expression: this.expression,
        context: this.context,
        entity: this
      });

      await ref.execute({
        ...options,
        context
      });
    } else {
      ref = document.createElement(this.expression.nodeName);
      for (var key in attributes) {
        ref.setAttribute(key, attributes[key]);
      }
      section = NodeSection.create(ref);
      this.preview = new NodePreview(this);
      for (var childExpression of this.expression.childNodes) {
        this.appendChild(await childExpression.execute({
          ...options,
          context,
          section
        }));
      }
    }

    this.section = section;

    options.section.appendChild(section.toFragment());
  }
}

export const fragment = FactoryFragment.create({
 ns: `entities/element`,
 factory: ElementEntity
});
