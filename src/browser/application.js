import BaseApplication from 'common/application/base';
import * as fragments from './fragments';
import editorFragment from 'editor-fragment';
import { fragment as htmlFragment } from 'html';
import Runloop from 'common/runloop';

export default class BrowserApplication extends BaseApplication {

  constructor(properties) {
    super(properties);

    this.runloop = Runloop.create();
  }

  _registerFragments() {
    super._registerFragments();

    this.fragmentDictionary.register(
      ...Object.values(fragments),
      editorFragment,
      htmlFragment
    );
  }
}
