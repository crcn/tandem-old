import create from 'common/utils/class/create';

export default class FilterBus {
  constructor(filter, successBus) {
    this.filter     = filter;
    this.successBus = successBus;
  }

  execute(event) {
    if (this.filter(event)) {
      this.successBus.execute(event);
    }
  }

  static create = create;
}
