import BaseCollection from 'common/collection';
import Plugin from './plugin';
import { ExistsError } from 'common/errors';
import sift from 'sift';

class Registry extends BaseCollection {

  register(entry) {
    this.push(entry);
    return entry;
  }

  query(search) {

    if (typeof search === 'string') {
      search = { id: search };
    }

    return this.filter(sift(search));
  }

  queryOne(search) {
    // less optimal. Use find. Okay for now.
    return this.query(search).shift();
  }

  // @param(Plugin) TODO
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
