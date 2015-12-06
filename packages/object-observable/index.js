import BaseObject from 'object-base';
import mixinChangeNotifier from 'mixin-change-notifier';

class ObservableObject extends BaseObject { }

ObservableObject = mixinChangeNotifier(ObservableObject);

export default ObservableObject;
