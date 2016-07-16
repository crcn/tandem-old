import loggable from 'common/logger/mixins/loggable';
import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';



function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable
export default class ClipboardService extends Service {
  initialize() {
    document.addEventListener('copy', (event) => {
      if (targetIsInput(event)) return;
      this.logger.info('handle copy');

      // TODO - serialize selection here
      // var expr = JSON.stringify(this.app.selection.map((ent) => ent.expression));
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
