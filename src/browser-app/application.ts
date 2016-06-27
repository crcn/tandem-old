

import IFragment from 'common/fragments/ifragment';
import BaseApplication from 'common/application/base';

import editorFragment from './fragments/editor/index';
import rootComponentFragment from './fragments/root-component/index';
 
class BrowserApplication extends BaseApplication {
  constructor(properties = {}) {
    super(properties, [
      editorFragment,
      rootComponentFragment
    ]);
  }
}

export default BrowserApplication;