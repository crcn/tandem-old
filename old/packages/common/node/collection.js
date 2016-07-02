import Collection from 'common/collection';
import mixinChangeNotifier from 'common/class/mixins/change-notifier';

class NodeCollection extends Collection {
  splice(start, length, ...newItems) {

    for (var item of newItems) {
      if (this.includes(item)) {
        throw new Error('attempting to add a child node twice');
      }
    }

    super.splice(start, length, ...newItems);
  }
}

NodeCollection = mixinChangeNotifier(NodeCollection);

export default NodeCollection;
