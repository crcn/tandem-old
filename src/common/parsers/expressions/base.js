import { create } from 'common/utils/class';

export default class BaseExpression {
  createEntity(properties) {
    return properties.fragmentDictionary.query(`entities/${this.ns}`).create({
      ...properties,
      expression: this,
    });
  }

  async execute(properties) {
    var entity = this.createEntity(properties);
    await entity.execute(properties);
    return entity;
  }

  static create = create;
}
