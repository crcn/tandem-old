import './template.scss';

import NodeSection from 'sf-front-end/section/node';
import FragmentSection from 'sf-front-end/section/fragment';
import bubbleIframeEvents from 'sf-front-end/utils/html/bubble-iframe-events';

import { ClassFactoryFragment, FactoryFragment } from 'sf-common/fragments/index';

class RegisteredEntityController {
  public section:any;
  public frame:any;
  public entity:any;

  constructor(properties) {
    Object.assign(this, properties);
    this.section = new FragmentSection();
  }

  async load(options) {
    for (var childExpression of this.frame.expression.childNodes) {
      this.entity.appendChild(await childExpression.load(Object.assign({}, options, {
        selectable: false
      })));
    }
  }
}


export default class FrameEntityController {

  public entity:any;
  public app:any;
  public section:any;
  public iframe:any;
  public expression:any;
  public attributes:any;

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

    this.section = new NodeSection(document.createElement('iframe'));
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
      new FactoryFragment(`entity-controllers/${this.attributes.id}`, {
          create: this.createElementController.bind(this)
      })
    );

    iframe.addEventListener('load', async () => {
      bubbleIframeEvents(iframe);
      var body = iframe.contentWindow.document.body;
      var bodySection = new NodeSection(body);
      Object.assign(bodySection.targetNode.style, {
        margin: 0,
        padding: 0,
      });
      this.setZoom();

      for (var childExpression of this.expression.childNodes) {
        await this.entity.appendChild(await childExpression.load(Object.assign({}, options, {
          section: bodySection
        })));
      }
    });
  }

  createElementController(properties) {
    return new RegisteredEntityController(Object.assign({}, properties, {
      frame: this
    }));
  }
}

export const fragment = new ClassFactoryFragment('entity-controllers/template', FrameEntityController);