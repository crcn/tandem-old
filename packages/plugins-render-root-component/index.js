import { CallbackNotifier } from 'notifiers';
import { ROOT_COMPONENT_ID } from 'registry-entries';
import ReactDOM from 'react-dom';

export default {
  create({ application }) {
    application.notifier.push(CallbackNotifier.create(function() {
        var rootComponentEntry = application.registry.find(sift({ id: ROOT_COMPONENT_ID }));
        ReactDOM.render(rootComponentEntry.create({ application: application }), application.config.element);
    }));
  }
};
