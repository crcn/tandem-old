import DisplayEntity from 'common/entities/display';

export default class DOMElementEntity extends DisplayEntity {
  constructor(properties) {
    super({
      displayType: 'htmlFrame',
      nodeType: 1,
      ...properties
    });
  }
}
