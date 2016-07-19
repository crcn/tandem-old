import 'babel-polyfill';

import * as path from 'path';
import { merge } from 'lodash';
import BaseApplication from 'saffron-common/lib/application/base';
 
import { fragment as dbServiceFragment } from './services/db';
import { fragment as fileServicerFragment } from './services/file';
import { fragment as upsertServiceFragment } from './services/upsert';
import { fragment as frontEndServiceFragment } from './services/front-end';
import { fragment as stdinServiceFragment } from './services/stdin';


export default class ServerApplication extends BaseApplication {
  constructor(properties) {
    super(properties);
    Object.assign(this.config, this._getConfig());
  }
  _getConfig() {
    const configPath = path.normalize(__dirname + '/../../../sfconfig');
    try {
      return require(configPath);
    } catch(e) {
      this.logger.error('cannot open %s.(js|json) config', configPath);
      return {};
    }
  }
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
