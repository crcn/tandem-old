import { CallbackNotifier, AcceptNotifier } from 'notifiers';
// import { INITIALIZE } from 'notifier-messages';
import { ROOT_COMPONENT_ID } from 'registry-entries';
import ReactDOM from 'react-dom';

export default {
  create({ app }) {

    // re-render on each notification
    app.notifier.push(CallbackNotifier.create(function() {
        var rootComponentEntry = app.registry.find(sift({ id: ROOT_COMPONENT_ID }));
        ReactDOM.render(rootComponentEntry.create({ app: app }), app.config.element);
    }));
  }
};
