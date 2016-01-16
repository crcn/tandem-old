import BaseApplication from '../base/app';
import SocketIOFragment from './fragments/socket.io';
import HTTPServerFragment from './fragments/http-server';

class ServerApplication extends BaseApplication {
  static fragments = BaseApplication.fragments.concat([
    HTTPServerFragment,
    SocketIOFragment
  ]);
}

export default ServerApplication;
