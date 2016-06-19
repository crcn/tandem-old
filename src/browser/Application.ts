

import IFragment from 'common/fragments/IFragment';
import BaseApplication from 'common/application/Base';

import editorFragment from './fragments/editor/index';
import rootComponentFragment from './fragments/root-component';
 
class BrowserApplication extends BaseApplication {
  constructor(properties = {}) {
    super(properties, [
      editorFragment,
      rootComponentFragment
    ]);
  }
}

export default BrowserApplication;