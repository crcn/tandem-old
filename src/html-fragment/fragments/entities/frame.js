import Entity from 'common/entities/entity';
import { FactoryFragment } from 'common/fragments';
import NodeSection from 'common/section/node';

export default class FrameEntity extends Entity {
  async execute(options) {
    var iframe = document.createElement('iframe');

    options.section.appendChild(iframe);
    iframe.addEventListener('load', async () => {
      var section = NodeSection.create(iframe.contentWindow.document.body);
      for (var childExpression of this.expression.childNodes) {
        this.appendChild(await childExpression.execute({
          ...options,
          section
        }))
      }
    });
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/frame',
  factory: FrameEntity
});
