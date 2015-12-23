
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
    }find

    return this.filter(function(plugin) {
      return plugin.matchesQuery(search);
    });
  }

  queryOne(search) {
    // less optimal. Use find. Okay for now.
    return this.query(search).shift();
  }

  // @param(Plugin) TODO
  // TODO - override splice here
  splice(index, count, ...entries) {

    entries.forEach((plugin) => {

      if (!(plugin instanceof Plugin)) {
        throw new Error('plugin must be an instanceof Plugin');
      }

      if (this.find(sift({ id: plugin.id }))) {
        throw ExistsError.create('plugin already exists');
      }
    });

    return super.splice(...arguments);
  }
}

export default Registry;
