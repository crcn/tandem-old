import BaseApplication from 'saffron-common/lib/application/base';

import fragments from './fragments';

export default class BrowserApplication extends BaseApplication {

  _registerFragments() {
    super._registerFragments();

    window.onerror = (err) => {
      this.bus.execute({ type: 'logServerError' });
    };

    this.fragments.register(...fragments);
  }
}
