import BaseApplication from '../base/app';
import HTTPServerFragment from './fragments/http-server';

class ServerApplication extends BaseApplication {

  static fragments = BaseApplication.fragments.concat([
    HTTPServerFragment
  ]);

}

export default ServerApplication;
