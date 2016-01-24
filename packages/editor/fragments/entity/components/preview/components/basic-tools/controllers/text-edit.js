import BaseObject from 'common/object/base';
import { SetToolMessage } from 'editor/message-types';

function convertElementToEntity(fragments, element) {
  if (element.nodeType === 1) {

    // only a span wrapping around text? return just the
    // text entity so that we do not have any extranous spans
    // floating around and polluting things
    if (element.nodeName === 'SPAN' && element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {

      var hasAttrValues = false;

      // TODO - check attr values
      if (!hasAttrValues) {
        return convertElementToEntity(fragments, element.childNodes[0]);
      }
    }

    return fragments.queryOne('entities/element').factory.create({
      tagName: element.nodeName.toLowerCase(),
      attributes: {
        ...element.attributes,
        style: element.style
      }
    }, Array.prototype.map.call(element.childNodes, convertElementToEntity.bind(this, fragments)).filter(function(child) {
      return !!child;
    }))
  } else if (element.nodeType === 3) {
    return fragments.queryOne('entities/text').factory.create({
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
      element.setAttribute('contenteditable', '');

      var entity = convertElementToEntity(this.app.fragments, element);

      // this.app.rootEntity.children.push(entity);
      selection.children.splice(0, selection.children.length, ...entity.children);

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
