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
    if (!app.focus) return;

    if (!app.focus.serialize) {
      console.warn('focused item does not implement the serialize() method, and so it\'s not copyable');
      return;
    }

    return JSON.stringify(app.focus.serialize());
  }

  function paste(data) {
    app.notifier.notify(PasteMessage.create(JSON.parse(data)));
  }

  document.addEventListener('copy', function(event) {

    var data = copy(event);
    if (data != void 0) {
      console.log('set clip');
      event.clipboardData.setData('text/x-entity', data);
    }

    event.preventDefault();
  });

  document.addEventListener('paste', function(event) {
    var data = event.clipboardData.getData('text/x-entity');
    if (data != void 0) {
      paste(data);
    }
  });
}
