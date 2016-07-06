import DisplayEntity from 'common/entities/display';

export default class DOMElementEntity extends DisplayEntity {
  constructor(properties) {
    super({
      type: 'htmlElement',
      nodeType: 1,
      ...properties
    });
  }
}
