import EditorApplication from 'editor/app';
import SocketIOFragment from './fragments/socket.io';

class BrowserApplication extends EditorApplication {
  static fragments = EditorApplication.fragments.concat([
    SocketIOFragment
  ]);
}

export default BrowserApplication;
