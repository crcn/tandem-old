import { UPLOAD_FILE } from 'editor/message-types';
import { TypeNotifier } from 'saffron-common/notifiers';
import { ApplicationFragment } from 'saffron-common/fragment/types';

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
        type: 'addFile',
        fileName: file.name,
        content: event.target.result
      })
    }

    reader.readAsDataURL(file);
  }
}
