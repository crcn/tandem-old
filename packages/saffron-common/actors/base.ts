import CoreObject from '../object/index';
import assertOverride from '../utils/assert/override';

export default class BaseActor extends CoreObject {
  execute(action) {
    assertOverride(this, 'execute');
  }
}
