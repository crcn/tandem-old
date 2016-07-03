import BaseApplication from 'common/application/base';
import renderRootComponentFragment from './fragments/render-root-component'

export default class BrowserApplication extends BaseApplication {
  _registerFragments() {
    super._registerFragments();

    this.fragmentDictionary.register(
      renderRootComponentFragment
    );
  }
}
