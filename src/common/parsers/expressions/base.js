import { create } from 'common/utils/class';

export default class BaseExpression {
  createEntity(properties) {
    var fragment = properties.fragments.query(`entities/${this.ns}`);
    if (!fragment) {
      throw new Error(`entity fragment "${this.ns}" does not exist`);
    }
    return fragment.create({
      ...properties,
      expression: this
    });
  }

  async load(properties) {
    var entity = this.createEntity(properties);
    await entity.load(properties);
    return entity;
  }

  static create = create;
}
