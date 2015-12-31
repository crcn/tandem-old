import BaseObject from 'common/object/base';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';

/**
 * Base observable object which dispatches a change message whenever
 * a property changes via setProperties()
 */

class ObservableObject extends BaseObject { }

ObservableObject = mixinChangeNotifier(ObservableObject);

export default ObservableObject;
