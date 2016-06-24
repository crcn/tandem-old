import BaseApplication from '../base/app';
import SocketIOFragment from './fragments/socket.io';
import SaveFileHandler from './fragments/save-file-handler';
import SaffronFileHandler from './fragments/saffron-file-handler';
import HTTPServerFragment from './fragments/http-server';

class ServerApplication extends BaseApplication {
  static fragments = BaseApplication.fragments.concat([
    SaveFileHandler,
    SocketIOFragment,
    HTTPServerFragment,
    SaffronFileHandler
  ]);
}

export default ServerApplication;
