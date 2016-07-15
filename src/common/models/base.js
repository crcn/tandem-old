import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';

@observable
export default class BaseModel extends CoreObject {

  /**
   */

  isNew() {
    return !this.id;
  }

  /**
   */

  save() {
    return this.isNew() ? this.insert() : this.update();
  }

  /**
   */

  remove() {
    if (!this.id) {
      return Promise.reject(
        new Error('cannot remove model without an ID')
      );
    }
    return this.fetch({
      type: 'remove',
      query: { id: this.id },
    });
  }

  /**
   */

  update() {
    if (!this.id) {
      return Promise.reject(
        new Error('cannot update model without an ID')
      );
    }
    return this.fetch({
      type: 'update',
      query: { id: this.id },
      data: this.serialize(),
    });
  }

  /**
   */

  insert() {
    return this.fetch({
      type: 'insert',
      data: this.serialize(),
    });
  }

  /**
   */

  load() {
    if (!this.id) {
      return Promise.reject(
        new Error('cannot load model without an ID')
      );
    }

    return this.fetch({
      type: 'find',
      query: { id: this.id },
    });
  }

  /**
   * keeps this model in sync with the DB it's
   * fetching from
   */

  sync() {
    // this.bus.execute({
    //   type: 'tail',
    //   query: {
    //     type: /insert|update|remove/
    //   }
    // }).pipeTo()
  }

  /**
   */

  serialize() {

  }

  /**
   */

  deserialize() {

  }

  /**
   * executes a command against the bus
   */

  async fetch(options) {
    var data = await this.bus.execute({
      ...options,
      target: this,
      collectionName: this.collectionName,
    }).read();

    this.setProperties({
      data: data,
    });

    return this;
  }
}
