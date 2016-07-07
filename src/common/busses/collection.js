import Collection from 'common/object/collection';

export default class BusCollection extends Collection {
  execute(event) {
    for (const bus of this) {
      bus.execute(event);
    }
  }
}
