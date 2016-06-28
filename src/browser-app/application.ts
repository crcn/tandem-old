

import { default as rootComponentFragment } from './fragments/render-root-component/index';
import BaseApplication from 'common/application/base';
import editorFragment from 'editor-fragments/index';
 
class BrowserApplication extends BaseApplication {
  constructor(properties = {}) {
    super(properties, [
      editorFragment,
      rootComponentFragment
    ]);
  }
}

export default BrowserApplication;