import { BaseComponent } from 'paperclip';
import { ComponentFactoryFragment } from 'paperclip/fragments';
import sift from 'sift';


class HTMLNodePreview {
  constructor(entity) {
    this.entity = entity;
    this.entity.setProperties({ preview: this });
    this.node = this.createNode();
  }
}

class HTMLElementPreview extends HTMLNodePreview {

  createNode() {
    var element = document.createElement(this.entity.name);

    if (this.entity.style) {
      Object.assign(element.style, this.entity.style);
    }

    for (var key in this.entity.attributes) {
      element.setAttribute(key, this.entity.attributes[key]);
    }

    this.entity.childNodes.map(createNodePreview).forEach(function(preview) {
      element.appendChild(preview.node);
    });

    return element;
  }
}


function createNodePreview(entity) {
  switch(entity.type) {
    case 'htmlElement': return new HTMLElementPreview(entity);
    case 'htmlText': return new HTMLTextPreview(entity);
  }
}



export default class PreviewComponent extends BaseComponent {
  initialize() {
    super.initialize();
    var rootEntity = this.application.rootEntity;
    this.section.appendChild(createNodePreview(rootEntity).node);
  }

  update() {
    super.update();
  }
}

export const fragment = ComponentFactoryFragment.create('components/preview', PreviewComponent);
