
import traverse from 'traverse';
import { getValue } from 'saffron-common/utils/object';
import { TypeNotifier } from 'saffron-common/notifiers';
import { PASTE, UPLOAD_FILE, SetFocusMessage } from 'editor/message-types';
import { deserialize as deserializeEntity } from 'saffron-common/entities';

export function create({ app }) {
  app.notifier.push(TypeNotifier.create(PASTE, paste));
  function paste(message) {
    if (message.item.type === 'text/x-entity') {
      pasteEntity(message);
    } else if (message.item.kind === 'file') {
      pasteFile(message);
    } else if (message.item.type === 'text/html') {
      pasteHTML(message);
    } else if (message.item.type === 'text/plain') {
      pastePlain(message);
    }
  }

  async function pastePlain(message) {
    var source = await {
      then(callback) {
        message.item.getAsString(callback);
      }
    };

    if (/^https?:\/\/.*?(png|jpg|gif)$/.test(source)) {
      var fragment = app.fragments.queryOne({
        id: 'elementEntity'
      });

      var img = fragment.factory.create({
        tagName: 'img',
        attributes: {
          src: source,
          style: {
            position: 'absolute',
            left: 0,
            top: 0
          }
        }
      });

      var selection = app.selection[0] || app.rootEntity;
      (selection.parent || selection).children.push(img);
    }
  }

  async function pasteHTML(message) {
    var source = await {
      then(callback) {
        message.item.getAsString(callback);
      }
    };
    console.error('no support for HTML pasting yet');
  }

  async function pasteFile(message) {
    var type = message.item.type;
    var blob = message.item.getAsFile();
    var ext    = type.split('/').pop();
    blob.name = Date.now() + ext;

    app.notifier.notify({
      type: UPLOAD_FILE,
      file: blob
    })
  }

  async function pasteEntity(message) {
    var json = JSON.parse(await {
      then(callback) {
        message.item.getAsString(callback);
      }
    });

    traverse.forEach(json, function(value) {

      // remove ID prop so that there's no collisions
      // with other entities
      // FIXME: need to make sure that "this" is an entity,
      // and not something else like a reference.
      if (this.key === 'id') {
        this.remove();
      }
    });

    var entities = json.items.map(function(rawData) {
      return deserializeEntity(rawData, app.fragments);
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
