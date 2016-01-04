import traverse from 'traverse';
import { getValue } from 'common/utils/object';
import { TypeNotifier } from 'common/notifiers';
import { PASTE, SetFocusMessage } from 'editor/message-types';
import { deserialize as deserializeEntity } from 'common/entities';

export function create({ app }) {
  app.notifier.push(TypeNotifier.create(PASTE, paste));
  function paste(message) {

    if (message.data.type !== 'html-selection') return;

    traverse.forEach(message.data, function(value) {

      // remove ID prop so that there's no collisions
      // with other entities
      // FIXME: need to make sure that "this" is an entity,
      // and not something else like a reference.
      if (this.key === 'id') {
        this.remove();
      }
    });

    var entities = message.data.items.map(function(rawData) {
      return deserializeEntity(rawData, { }, app.fragments);
    });

    var insertIndex;
    var parentEntity;

    // if there is an entiy in focus, then add the new entity
    // as a sibling of it
    if (app.selection.length) {
      parentEntity = app.selection[0].parent;
      insertIndex  = parentEntity.children.indexOf(app.selection[0]) + 1;

      // otherwise add to the root entity
    } else {
      parentEntity = app.rootEntity;
      insertIndex  = parentEntity.children.length;
    }

    parentEntity.children.splice(insertIndex, 0, ...entities);

    // focus on our newly pasted item
    app.notifier.notify(SetFocusMessage.create(entities));
  }

  return [];
}
