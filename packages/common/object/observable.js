import BaseObject from 'common/object/base';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';

class ObservableObject extends BaseObject { }

ObservableObject = mixinChangeNotifier(ObservableObject);

export default ObservableObject;
