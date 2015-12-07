import BaseCollection from 'common/collection';

class NotifierCollection extends BaseCollection {
  notify(message) {
    var promises = [];

    for (var observer of this) {
      promises.push(observer.notify(message));
    }

    return Promise.all(promises);
  }
}

export default NotifierCollection;
