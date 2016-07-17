import BaseApplication from 'saffron-common/application/base';

import { fragment as dbServiceFragment } from './services/db';
import { fragment as fileServicerFragment } from './services/file';
import { fragment as upsertServiceFragment } from './services/upsert';
import { fragment as frontEndServiceFragment } from './services/front-end';
import { fragment as stdinServiceFragment } from './services/stdin';

export default class ServerApplication extends BaseApplication {
  _registerFragments() {
    super._registerFragments();
    this.fragments.register(
      dbServiceFragment,
      fileServicerFragment,
      stdinServiceFragment,
      upsertServiceFragment,
      frontEndServiceFragment
    );
  }
}
