import NodeSection from 'common/section/node';

import { create } from 'common/utils/class';
import { FactoryFragment } from 'common/fragments';

class RegisteredEntityController {
  constructor(properties) {
    Object.assign(this, properties);
  }

  async load(options) {
    for (var childExpression of this.frame.expression.childNodes) {
      this.entity.appendChild(await childExpression.load({
        ...options,
        selectable: false
      }));
    }
  }

  static create = create;
}


export default class FrameEntityController {
  constructor(properties) {
    Object.assign(this, properties);
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  load(options) {

    var iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
      border: 0,
      margin: 0,
      backgroundColor: 'white',
      position: 'relative',
    });

    options.fragments.register(
      FactoryFragment.create({
        ns: `entity-controllers/${this.attributes.id}`,
        factory: {
          create: this.createElementController.bind(this)
        }
      })
    );

    iframe.addEventListener('load', async () => {
      var bodySection = NodeSection.create(iframe.contentWindow.document.body);
      Object.assign(bodySection.targetNode.style, {
        margin: 0,
        padding: 0,
      });
      for (var childExpression of this.expression.childNodes) {
        await this.entity.appendChild(await childExpression.load({
          ...options,
          section: bodySection,
        }));
      }
    });

    this.section.appendChild(iframe);
  }

  createElementController(properties) {
    return RegisteredEntityController.create({
      ...properties,
      frame: this,
    });
  }

  static create = create;
}

export const fragment = FactoryFragment.create({
  ns      : 'entity-controllers/template',
  factory : FrameEntityController,
});
