import Entity from '../index';

export default class DisplayEntity extends Entity {
  constructor(properties) {
    super({
      type: 'display',
      ...properties
    })
  }
}
