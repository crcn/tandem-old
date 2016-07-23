import BaseApplication from 'saffron-common/src/application/base';
import IFrontEndApplication from './interface';

import fragments from './fragments';

export default class BrowserApplication extends BaseApplication implements IFrontEndApplication {

  public selection:any;

  /*
  public selection:Array<Entity>;
  public windows
  */
  
  _registerFragments() {
    super._registerFragments();
    this.fragments.register(...fragments);
  }
}