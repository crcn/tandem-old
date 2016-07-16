import loggable from 'common/logger/mixins/loggable';
import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';

@loggable
export default class ClipboardService extends Service {
  initialize() {
    document.addEventListener('copy', (event) => {
      this.logger.info('handle copy');
      event.clipboardData.setData('text/x-entity', Date.now().toString());
      event.preventDefault();
    });

    document.addEventListener('paste', (event) => {
      this.logger.info('handle paste');
      Array.prototype.forEach.call(event.clipboardData.items, this._paste);
    });
  }

  _paste = async (item) => {
    try {
      await this.bus.execute({ type: 'paste', item: item });
    } catch(e) {
      this.logger.warn('cannot paste x-entity data: ', item.type);
    }
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/services/clipboard',
  factory : ClipboardService
});
