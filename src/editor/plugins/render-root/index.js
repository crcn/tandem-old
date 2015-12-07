import { CallbackNotifier } from 'common/notifiers';
import { ROOT_COMPONENT_ID } from 'editor/entries';
import React from 'react';
import ReactDOM from 'react-dom';
import sift from 'sift';

export default {
  create({ app }) {

    app.notifier.push(CallbackNotifier.create(function(message) {
      var entry = app.registry.find(sift({id: ROOT_COMPONENT_ID }));
      ReactDOM.render(entry.create({ app: app }), app.config.element);
    }));
  }
}
