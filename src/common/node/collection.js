import Collection from 'common/collection';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';

class NodeCollection extends Collection {
}

NodeCollection = mixinChangeNotifier(NodeCollection);

export default NodeCollection;
