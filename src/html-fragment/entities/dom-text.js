import DisplayEntity from 'common/entities/display';

export default class DOMTextEntity extends DisplayEntity {
  constructor(properties) {
    super({
      displayType: 'htmlText',
      nodeType: 3,
      ...properties
    });
  }
}
