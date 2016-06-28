import {
  ApplicationFragment
} from 'editor/fragment/types';

import {
  PasteMessage
} from 'editor/message-types';

export default ApplicationFragment.create({
  id: 'clipboard',
  factory: {
    create: create
  }
});

function create({ app }) {

  function copy() {

    // nothing in focus
    if (!app.selection) return;

    if (!app.selection.serialize) {
      console.warn('focused item does not implement the serialize() method, and so it\'s not copyable');
      return;
    }

    return JSON.stringify(app.selection.serialize());
  }

  function paste(item) {
    try {
      console.info('paste %s', item.type);
      app.notifier.notify(PasteMessage.create(item));
    } catch(e) {
      console.warn('cannot paste x-entity data: ', item.type);
    }
  }

  function targetIsInput(event) {
    return /input|textarea/i.test(event.target.nodeName);
  }

  document.addEventListener('copy', function(event) {

    if (targetIsInput(event)) return;

    var data = copy(event);
    if (data != void 0) {
      event.clipboardData.setData('text/x-entity', data);
    }

    event.preventDefault();
  });

  document.addEventListener('paste', function(event) {
    if (targetIsInput(event)) return;
    Array.prototype.forEach.call(event.clipboardData.items, paste);
  });
}
