import BaseApplication from 'common/application/base';
import fs from 'fs';
import * as fragments from './fragments';

export default class ServerApplication extends BaseApplication {
  _registerFragments() {
    super._registerFragments();
    this.fragmentDictionary.register(Object.values(fragments));
  }
}
