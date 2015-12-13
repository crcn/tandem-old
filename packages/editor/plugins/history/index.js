// FIXME: this plugin is a hack. Fine for now, but needs to be
// cleaned up

// TODO: diff history - reduce all data to figure out snapshot.
// Use key frames to reduce diffing amount.

// Diff could also be dispatched across the network for realtime Shenanigans.

import sift from 'sift';
import debounce from 'lodash/function/debounce';
import { CallbackNotifier } from 'common/notifiers';
import ObservableCollection from 'common/collection/observable';
import { Entity, deserialize } from 'editor/entity-types';
import { TypeNotifier } from 'common/notifiers';
import HistorySliderComponent from './components/slider';
import {
  ApplicationPlugin,
  KeyCommandPlugin,
  ComponentPlugin
} from 'editor/plugin/types';
import { SET_ROOT_ENTITY } from 'editor/message-types';

const DEBOUNCE_TIMEOUT = 300;

export default ApplicationPlugin.create({
  id: 'historyPlugin',
  factory: {
    create: create
  }
});

function create({ app }) {

  var history = ObservableCollection.create({
    notifier: app.notifier
  });

  history.move = move;

  app.notifier.push(TypeNotifier.create(SET_ROOT_ENTITY, (message) => {
    history.position = 0;
    saveNow();
  }));

  var saveNow = function() {

    history.splice(
      history.position,
      history.length - history.position,
      app.rootEntity.serialize()
    );

    // FIXME: position gets set after splice fires an event. This
    // is fine since most stuff executes on rAF, but this is still
    // a bug - might cause race conditions in the future.
    // MAYBE use a getter / setter instead.
    history.position = history.length;

  }

  // TODO - diff this stuff to save on memory
  var save = debounce(saveNow, DEBOUNCE_TIMEOUT);

  function move(position) {
    history.position = position;

    if (!history.length) return;

    // Note that focus might be an entity in the future
    var currentFocusId = app.focus ? app.focus.id : void 0;

    var rootEntity = deserialize(history[history.position], {
      notifier: app.notifier
    }, app.plugins);

    app.setProperties({
      rootEntity : rootEntity
    });

    app.setFocus(currentFocusId ? rootEntity.find(sift({ id: currentFocusId })) : void 0);
  }

  function shift(step) {

    // last item is the most current change. We need to step back
    // one more time if the position is at the end.
    if (history.position == history.length && step === -1) {
      // step -= 1;
    }

    move(Math.max(0, Math.min(history.length - 1, history.position + step)));
  }

  function filterEntity(value) {
    return value instanceof Entity;
  }

  function changeContainsEntity(change) {
    return filterEntity(change.target) ||
      (Array.isArray(change.target) && change.target.find(filterEntity));
  }

  app.notifier.push(CallbackNotifier.create(function(message) {
    if (message.type !== 'change') return;
    if (!message.changes.find(changeContainsEntity)) return;
    save();
  }));

  app.plugins.push(
    KeyCommandPlugin.create({
      id         : 'undoCommand',
      keyCommand : 'command+z',
      handler    : shift.bind(this, -1)
    }),
    KeyCommandPlugin.create({
      id         : 'redoCommand',
      keyCommand : 'command+y',
      handler    : shift.bind(this, 1)
    }),
    ComponentPlugin.create({
      history        : history,
      id             : 'historySliderComponent',
      paneType       : 'footer',
      componentClass : HistorySliderComponent
    })
  );
}
