import IFragment from 'common/fragments/IFragment';
import BaseApplication from 'common/application/Base';
import editorFragment from './fragments/editor';
 
class BrowserApplication extends BaseApplication {
  constructor(properties = {}) {
    super(properties);
  }

  protected _createFragments():Array<IFragment> {
    return [
      editorFragment
    ]
  }
}

export default BrowserApplication;