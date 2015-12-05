import BaseCollection from 'base-collection';
import Entry from './entry';
import sift from 'sift';
import { ExistsError } from 'errors';

class Registry extends BaseCollection {

  // @param(Entry) TODO
  register(entry) {

    if (this.find(sift({ id: entry.id }))) {
      throw ExistsError.create('entry already exists');
    }

    this.push(entry);
    return entry;
  }
}

export default Registry;
