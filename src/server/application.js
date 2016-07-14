import * as fragments from './fragments';
import BaseApplication from 'common/application/base';
import { AcceptBus } from 'mesh';
import sift from 'sift';

export default class ServerApplication extends BaseApplication {
  _registerFragments() {
    super._registerFragments();
    this.fragmentDictionary.register(Object.values(fragments));
  }
}
