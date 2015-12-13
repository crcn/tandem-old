import { ApplicationPlugin, KeyCommandPlugin } from 'editor/plugin/types';
import { CallbackNotifier } from 'common/notifiers';
import { Entity, deserialize } from 'editor/entity-types';
import debounce from 'lodash/function/debounce';
import sift from 'sift';

const DEBOUNCE_TIMEOUT = 300;

export default ApplicationPlugin.create({
  id: 'historyPlugin',
  factory: {
    create: create
  }
});

function create({ app }) {

  var history = [];
  var cursor  = 0;

  // TODO - diff this stuff to save on memory
  var save = debounce(function() {

    history.splice(
      cursor,
      history.length - cursor,
      app.rootEntity.serialize()
    );

    cursor = history.length;

  }, DEBOUNCE_TIMEOUT);

  function move(step) {
    cursor = Math.max(0, Math.min(history.length - 1, cursor + step));
    if (!history.length) return;

    // Note that focus might be an entity in the future
    var currentFocusId = app.focus ? app.focus.id : void 0;

    var rootEntity = deserialize(history[cursor], {
      notifier: app.notifier
    }, app.plugins);

    app.setProperties({
      rootEntity : rootEntity
    });

    app.setFocus(currentFocusId ? rootEntity.find(sift({ id: currentFocusId })) : void 0);
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
      handler    : move.bind(this, -1)
    }),
    KeyCommandPlugin.create({
      id         : 'redoCommand',
      keyCommand : 'command+y',
      handler    : move.bind(this, 1)
    })
  );
}
