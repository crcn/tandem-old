import Collection from 'common/object/collection';

export default class DispatcherCollection extends Collection {
  dispatch(event) {
    for (const dispatcher of this) {
      dispatcher.dispatch(event);
    }
  }
}
