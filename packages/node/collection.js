import Collection from 'collection';
import mixinChangeNotifier from 'mixin-change-notifier';

class NodeCollection extends Collection {
}

NodeCollection = mixinChangeNotifier(NodeCollection);

export default NodeCollection;
