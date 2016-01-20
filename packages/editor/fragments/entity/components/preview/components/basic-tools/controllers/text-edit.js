import BaseObject from 'common/object/base';
import { SetToolMessage } from 'editor/message-types';

function convertElementToEntity(fragments, element) {
  if (element.nodeType === 1) {
    return fragments.queryOne({
      id: 'elementEntity'
    }).factory.create({
      tagName: element.nodeName.toLowerCase(),
      attributes: {
        ...element.attributes,
        style: {}
      }
    }, Array.prototype.map.call(element.childNodes, convertElementToEntity.bind(this, fragments)).filter(function(child) {
      return !!child;
    }))
  } else if (element.nodeType === 3) {
    return fragments.queryOne({
      id: 'textEntity'
    }).factory.create({
      value: element.nodeValue
    });
  }
}

class TextEditTool extends BaseObject {

  type = 'edit';

  notify(message) {
    switch(message.type) {
      case 'textEditComplete': return this.notifyTextEditComplete(message);
      case 'selectTool': return this.select();
    }
  }

  select() {

    // only one
    var selection = this.app.selection[0];
    var preview = selection.preview;
    var element = preview.displayObject.element;

    // TODO - maybe a border here
    element.style.outline = 'none';
    element.setAttribute('contenteditable', true);
    element.focus();

    this.app.setProperties({ hideToolsLayer: true });

    element.onblur = () => {

      var entity = convertElementToEntity(this.app.fragments, element);

      // this.app.rootEntity.children.push(entity);

      selection.setProperties({
        value: element.innerHTML
      });
      // TODO - convert DOM nodes to entities here
      this.notifyTextEditComplete(void 0);
    }
  }

  notifyTextEditComplete() {
    this.app.setProperties({ hideToolsLayer: false });
    this.notifier.notify(SetToolMessage.create(this.pointerTool));
  }
}

export default TextEditTool;
