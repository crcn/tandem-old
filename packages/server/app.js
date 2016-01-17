import BaseApplication from '../base/app';
import ProjectFragment from './fragments/project';
import SocketIOFragment from './fragments/socket.io';
import HTTPServerFragment from './fragments/http-server';

class ServerApplication extends BaseApplication {
  static fragments = BaseApplication.fragments.concat([
    HTTPServerFragment,
    SocketIOFragment,
    ProjectFragment
  ]);
}

export default ServerApplication;
