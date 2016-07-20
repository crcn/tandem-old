import 'babel-polyfill';

import * as path from 'path';
import BaseApplication from 'saffron-common/lib/application/base';
 
import { fragment as dbServiceFragment } from './services/db';
import { fragment as fileServicerFragment } from './services/file';
import { fragment as stdinServiceFragment } from './services/stdin';
import { fragment as upsertServiceFragment } from './services/upsert';
import { fragment as frontEndServiceFragment } from './services/front-end';


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
