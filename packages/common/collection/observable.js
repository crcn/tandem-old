import Collection from './index';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';

class ObservableCollection extends Collection { }

ObservableCollection = mixinChangeNotifier(ObservableCollection);

export default ObservableCollection;
