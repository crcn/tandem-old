import BaseCollection from 'base-collection';
import Entry from './entry';
import sift from 'sift';
import { ExistsError } from 'errors';

class Registry extends BaseCollection {

  register(entry) {
    this.push(entry);
    return entry;
  }

  // @param(Entry) TODO
  // TODO - override splice here
  splice(index, count, ...entries) {

    entries.forEach((entry) => {
      if (this.find(sift({ id: entry.id }))) {
        throw ExistsError.create('entry already exists');
      }
    });

    return super.splice(...arguments);
  }
}

export default Registry;
