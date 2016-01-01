import traverse from 'traverse';
import { PASTE, SetFocusMessage } from 'editor/message-types';
import { getValue } from 'common/utils/object';
import { TypeNotifier } from 'common/notifiers';
import { deserialize as deserializeEntity } from 'editor/entities';

export function create({ app }) {
  app.notifier.push(TypeNotifier.create(PASTE, paste));
  function paste(message) {

    // FIXME: this is a dirty check. Need to check a type
    // on pasted item. Possibly look up fragmentId, then check entity
    // type there. That solution though also has its issues...
    if (!message.data.props || !message.data.children) return;

    traverse.forEach(message.data, function(value) {

      // remove ID prop so that there's no collisions
      // with other entities
      // FIXME: need to make sure that "this" is an entity,
      // and not something else like a reference.
      if (this.key === 'id') {
        this.remove();
      }
    });

    // clone it!
    var entity = deserializeEntity(message.data, { }, app.fragments);

    var insertIndex;
    var parentEntity;

    // if there is an entiy in focus, then add the new entity
    // as a sibling of it
    if (app.focus) {
      parentEntity = app.focus.parent;
      insertIndex  = parentEntity.children.indexOf(app.focus) + 1;

      // otherwise add to the root entity
    } else {
      parentEntity = app.rootEntity;
      insertIndex  = parentEntity.children.length;
    }

    parentEntity.children.splice(insertIndex, 0, entity);

    // focus on our newly pasted item
    app.notifier.notify(SetFocusMessage.create(entity));
  }

  return [];
}
