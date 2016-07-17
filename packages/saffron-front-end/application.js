import BaseApplication from 'saffron-common/application/base';

import { fragment as htmlBundleFragment } from 'html-bundle';
import { fragment as sassBundleFragment } from 'sass-bundle';
import { fragment as editorFragment } from 'editor';

import { fragment as backEndServiceFragment } from './services/back-end';
import { fragment as rootComponentRendererFragment } from './services/root-component-renderer';

export default class BrowserApplication extends BaseApplication {

  _registerFragments() {
    super._registerFragments();

    this.fragments.register(
      htmlBundleFragment,
      sassBundleFragment,
      editorFragment,
      backEndServiceFragment,
      rootComponentRendererFragment
    );
  }
}
