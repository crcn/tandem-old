// FIXME: this fragment is a hack. Fine for now, but needs to be
// cleaned up

// TODO: diff history - reduce all data to figure out snapshot.
// Use key frames to reduce diffing amount. (OR use JS-GIT for this)

// Diff could also be dispatched across the network for realtime Shenanigans.

import sift from 'sift';
import debounce from 'lodash/function/debounce';

import { create as createSliderFragments } from './fragments/slider';
import { create as createKeyCommandFragments } from './fragments/key-commands';

// used for history. See this: https://github.com/creationix/js-git
// import createMemDb from 'js-git/mixins/mem-db';

import ObservableCollection from 'common/collection/observable';
import { CallbackNotifier, TypeNotifier } from 'common/notifiers';

import { Entity, deserialize } from 'editor/entities';
import { SET_ROOT_ENTITY, SetFocusMessage } from 'editor/message-types';

import {
  ApplicationFragment,
  KeyCommandFragment,
  ComponentFragment
} from 'editor/fragment/types';

const DEBOUNCE_TIMEOUT = 300;

export default ApplicationFragment.create({
  id: 'historyFragment',
  factory: {
    create: create
  }
});

function create({ app }) {


  var history = ObservableCollection.create({
    notifier: app.notifier
  });

  history.move = move;
  history.shift = shift;

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
    }, app.fragments);

    app.setProperties({

      // FIXME:
      // need this here, otherwise the DOM might re-render
      // immediately, and components trying to access a focused entity
      // that does not exist will barf all over the place. This is a leak.
      focus      : void 0,
      rootEntity : rootEntity
    });

    app.notifier.notify(SetFocusMessage.create(currentFocusId ? rootEntity.find(sift({ id: currentFocusId })) : void 0));
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

  app.fragments.push(
    ...createKeyCommandFragments({ app, history }),
    ...createSliderFragments({ app, history })
  );
}
