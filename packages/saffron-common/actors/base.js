import CoreObject from '../object';
import assertOverride from '../utils/assert/override';

export default class BaseActor extends CoreObject {
  execute() {
    assertOverride(this, 'execute');
  }
}
