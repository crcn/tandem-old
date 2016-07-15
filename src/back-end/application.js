import BaseApplication from 'common/application/base';

import { fragment as dbServiceFragment } from './services/db';
import { fragment as fileServiceFragment } from './services/file';
import { fragment as frontEndServiceFragment } from './services/front-end';

export default class ServerApplication extends BaseApplication {
  _registerFragments() {
    super._registerFragments();
    this.fragmentDictionary.register(
      dbServiceFragment,
      fileServiceFragment,
      frontEndServiceFragment,
    );
  }
}
