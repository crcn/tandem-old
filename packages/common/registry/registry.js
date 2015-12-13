
import sift from 'sift';
import Plugin from './plugin';
import BaseCollection from 'common/collection';
import { ExistsError } from 'common/errors';

class Registry extends BaseCollection {

  register(plugin) {
    this.push(plugin);
    return plugin;
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

    entries.forEach((plugin) => {
      if (this.find(sift({ id: plugin.id }))) {
        throw ExistsError.create('plugin already exists');
      }
    });

    return super.splice(...arguments);
  }
}

export default Registry;
