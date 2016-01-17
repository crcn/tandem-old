import BaseApplication from '../base/app';
import SocketIOFragment from './fragments/socket.io';
import SaffronFileHandler from './fragments/saffron-file-handler';
import HTTPServerFragment from './fragments/http-server';

class ServerApplication extends BaseApplication {
  static fragments = BaseApplication.fragments.concat([
    HTTPServerFragment,
    SocketIOFragment,
    SaffronFileHandler
  ]);
}

export default ServerApplication;
