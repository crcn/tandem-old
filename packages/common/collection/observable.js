import Collection from './index';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';

/**
 * Observable collection which dispatches a change message whenever setProperties(), or
 * a mutation method is called
 */

class ObservableCollection extends Collection { }

ObservableCollection = mixinChangeNotifier(ObservableCollection);

export default ObservableCollection;
