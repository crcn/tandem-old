import fs from 'fs';
import * as fragments from './fragments';
import BaseApplication from 'common/application/base';

export default class ServerApplication extends BaseApplication {
  _registerFragments() {
    super._registerFragments();
    this.fragmentDictionary.register(Object.values(fragments));
  }
}
