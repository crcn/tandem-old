import CoreObject from 'common/object';
import assertOverride from 'common/utils/assert/override';

export default class BaseActor extends CoreObject {
  execute() {
    assertOverride(this, 'execute');
  }
}
