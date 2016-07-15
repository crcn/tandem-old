import BaseApplication from 'common/application/base';
import * as fragments from './fragments';

import { fragment as htmlFragment } from 'html';
import { fragment as editorFragment } from 'editor';

import { fragment as rootComponentRendererFragment } from './actors/root-component-renderer';
import { fragment as backEndActorFragment } from './actors/back-end';

export default class BrowserApplication extends BaseApplication {

  _registerFragments() {
    super._registerFragments();

    this.fragmentDictionary.register(
      ...Object.values(fragments),
      editorFragment,
      rootComponentRendererFragment,
      backEndActorFragment
    );
  }
}
