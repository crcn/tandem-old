import BaseApplication from 'common/application/base';

import { fragment as dbActorFragment } from './actors/db';
import { fragment as fileActorFragment } from './actors/file';
import { fragment as upsertActorFragment } from './actors/upsert';
import { fragment as frontEndActorFragment } from './actors/front-end';

export default class ServerApplication extends BaseApplication {
  _registerFragments() {
    super._registerFragments();
    this.fragmentDictionary.register(
      dbActorFragment,
      fileActorFragment,
      upsertActorFragment,
      frontEndActorFragment,
    );
  }
}
