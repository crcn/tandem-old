import BaseCollection from 'base-collection';
import Entry from './entry';

class Registry extends BaseCollection {

  // @param(Entry) TODO
  register(entry) {
    this.push(entry);
    return entry;
  }

}

export default Registry;
