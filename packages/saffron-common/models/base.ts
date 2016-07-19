import CoreObject from '../object/index';
import observable from '../object/mixins/observable';
import { Bus } from 'mesh';

@observable
export default class BaseModel extends CoreObject {

  public bus:Bus;
  public collectionName:string;

  /**
   */

  isNew() {
    return !this.id;
  }

  /**
   */

  save():any  {
    return this.isNew() ? this.insert() : this.update();
  }

  /**
   */

  remove():any {
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

  update():any  {
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

  insert():any {
    return this.fetch({
      type: 'insert',
      data: this.serialize(),
    });
  }

  /**
   */

  load():any {
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
    var data = await this.bus.execute(Object.assign({}, options, {
      target: this,
      collectionName: this.collectionName
    })).read();

    this.setProperties({
      data: data
    });

    return this;
  }
}
