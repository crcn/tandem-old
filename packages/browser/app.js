import EditorApplication from 'editor/app';
import SocketIOFragment from './fragments/socket.io';
import UploadFileHandlerFragment from './fragments/upload-file-handler';

class BrowserApplication extends EditorApplication {
  static fragments = EditorApplication.fragments.concat([
    SocketIOFragment,
    UploadFileHandlerFragment
  ]);
}

export default BrowserApplication;
