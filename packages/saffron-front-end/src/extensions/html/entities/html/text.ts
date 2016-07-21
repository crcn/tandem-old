import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';

import Entity from 'saffron-front-end/src/entities/entity';

class TextEntity extends Entity {

  public node:any;
  
  async load({ section }) {
    section.appendChild(this.node = document.createTextNode(this.expression.nodeValue));
  }

  update() {
    this.node.nodeValue = this.expression.nodeValue;
  }

  willUnmount() {
    this.node.parentNode.removeChild(this.node);
  }
}

export const fragment = new ClassFactoryFragment('entities/htmlText', TextEntity);