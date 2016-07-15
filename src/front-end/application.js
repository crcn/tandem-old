import BaseApplication from 'common/application/base';
import * as fragments from './fragments';

import { fragment as htmlFragment } from 'html';
import { fragment as editorFragment } from 'editor';

import { fragment as backEndServiceFragment } from './services/back-end';
import { fragment as rootComponentRendererFragment } from './services/root-component-renderer';


export default class BrowserApplication extends BaseApplication {

  _registerFragments() {
    super._registerFragments();

    this.fragmentDictionary.register(
      ...Object.values(fragments),
      htmlFragment,
      editorFragment,
      backEndServiceFragment,
      rootComponentRendererFragment
    );
  }
}
