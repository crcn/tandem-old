import BasePreview from './base';

export default class ContainerPreview extends BasePreview {
  async load() {
    var node = await this.loadChildNodes();
  }

  async loadChildNodes() {

  }
}
