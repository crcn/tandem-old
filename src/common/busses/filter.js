import create from 'common/utils/class/create';
import NoopBus from './noop';

export default class FilterBus {
  constructor(filter, successBus, failBus) {
    this.filter     = filter;
    this.successBus = successBus || NoopBus.create();
    this.failBus    = failBus || NoopBus.create();
  }

  execute(event) {
    if (this.filter(event)) {
      this.successBus.execute(event);
    } else {
      this.failBus.execute(event);
    }
  }

  static create = create;
}
