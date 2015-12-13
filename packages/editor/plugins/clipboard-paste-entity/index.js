import { PASTE } from 'editor/message-types';
import { deserialize as deserializeEntity } from 'editor/entity-types';
import { TypeNotifier } from 'common/notifiers';
import { ApplicationPlugin } from 'editor/plugin/types';
import { getValue } from 'common/utils/object';
import traverse from 'traverse';

export default ApplicationPlugin.create({
  id: 'clipboardPasteEntity',
  factory: {
    create: create
  }
});

function create({ app }) {
  app.notifier.push(TypeNotifier.create(PASTE, paste));
  function paste(message) {

    // FIXME: this is a dirty check. Need to check a type
    // on pasted item. Possibly look up pluginId, then check entity
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

    var entity = deserializeEntity(message.data, { }, app.plugins);

    var focus = app.focus || app.rootEntity;

    if (focus.componentType === 'text') {
      focus = focus.parent;
    }

    focus.children.push(entity);
  }
}
