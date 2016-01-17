import { UPLOAD_FILE } from 'editor/message-types';
import { TypeNotifier } from 'common/notifiers';
import { ApplicationFragment } from 'common/fragment/types';

export default ApplicationFragment.create({
  id: 'uploadFileHandler',
  factory: {
    create: create
  }
});

function create({ app }) {
  app.notifier.push(TypeNotifier.create(UPLOAD_FILE, uploadFile));

  function uploadFile({ file }) {

    var reader = new FileReader();

    reader.onload = function(event) {
      app.notifier.notify({
        type: 'saveFile',
        filePath: file.name,
        content: event.target.result
      })
    }

    reader.readAsDataURL(file);
  }
}
