import BaseApplication from 'common/application/base';
import * as fragments from './fragments';
import editorFragment from 'editor-fragment';
import entityFragment from 'entity-fragment';
import htmlFragment from 'html-fragment';
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
      entityFragment,
      htmlFragment
    );
  }
}
