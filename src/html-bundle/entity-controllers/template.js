import './template.scss';

import NodeSection from 'common/section/node';
import FragmentSection from 'common/section/fragment';
import bubbleIframeEvents from 'common/utils/html/bubble-iframe-events';

import { create } from 'common/utils/class';
import { FactoryFragment } from 'common/fragments';

class RegisteredEntityController {
  constructor(properties) {
    Object.assign(this, properties);
    this.section = FragmentSection.create();
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

    // flag the entity as isolated (iframes are) so that visual
    // calculations work properly for child node.
    this.entity.isolated = true;

    // hacky, but we need the zoom.
    this.app.actors.push({
      execute: (event) => {
        if (event.type === 'change') {
          for (var change of event.changes) {
            if (change.target === this.app && change.property === 'zoom') {
              setTimeout(this.setZoom.bind(this, this.app.zoom), 100);
            }
          }
        }
      }
    });

    this.section = NodeSection.create(document.createElement('iframe'));
  }

  /**
   * janky, but we need to copy zoom from the app since
   * iframes do not inherit the property.
   */

  setZoom() {
    this.iframe.contentWindow.document.body.style.zoom = this.app.zoom;
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  load(options) {

    var iframe = this.iframe = options.section.targetNode;
    iframe.setAttribute('class', 'm-entity-controller-template');

    options.fragments.register(
      FactoryFragment.create({
        ns: `entity-controllers/${this.attributes.id}`,
        factory: {
          create: this.createElementController.bind(this)
        }
      })
    );

    iframe.addEventListener('load', async () => {
      bubbleIframeEvents(iframe);
      var body = iframe.contentWindow.document.body;
      var bodySection = NodeSection.create(body);
      Object.assign(bodySection.targetNode.style, {
        margin: 0,
        padding: 0,
      });
      this.setZoom();

      for (var childExpression of this.expression.childNodes) {
        await this.entity.appendChild(await childExpression.load({
          ...options,
          section: bodySection,
        }));
      }
    });
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
