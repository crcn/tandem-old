import {
  BaseApplication
} from 'sf-common/index';

import { fragment as htmlExtensionFragment } from 'sf-html-extension/index';


export default class FrontEnndApplication extends BaseApplication {
  protected _registerFragments() {
    super._registerFragments();
    this.fragments.register(
      htmlExtensionFragment
    );
  }
}