import {
  BaseApplication
} from 'saffron-common/src/index';

import { fragment as htmlExtensionFragment } from 'saffron-html-extension/index';


export default class FrontEnndApplication extends BaseApplication {
  protected _registerFragments() {
    super._registerFragments();
    this.fragments.register(
      htmlExtensionFragment
    );
  }
}