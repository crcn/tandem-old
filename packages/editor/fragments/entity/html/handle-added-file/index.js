import { ADDED_FILE } from 'editor/message-types';
import { TypeNotifier } from 'common/notifiers';
import { ApplicationFragment } from 'common/fragment/types';

export function create({ app }) {
  app.notifier.push(TypeNotifier.create(ADDED_FILE, handleImage));

  function handleImage({ fileName, url }) {
    console.log(fileName);
    if (!/(png|gif|jpg)$/.test(fileName)) return;
    var fragment = app.fragments.queryOne({
      id: 'elementEntity'
    });

    console.log(app.mouseX, app.mouseY);

    var img = fragment.factory.create({
      tagName: 'img',
      attributes: {
        src: url,
        style: {
          position: 'absolute',
          top: app.mouseY,
          left: app.mouseX
        }
      }
    });

    app.rootEntity.children.push(img);
  }

  return [];
}
