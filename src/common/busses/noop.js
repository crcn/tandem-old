import create from 'common/utils/class/create';

export default class NoopBus {
  execute(event) { }
  static create = create;
}
