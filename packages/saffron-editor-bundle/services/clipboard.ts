import loggable from 'saffron-common/logger/mixins/loggable';
import { Service } from 'saffron-common/services';
import { FactoryFragment } from 'saffron-common/fragments';

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable
export default class ClipboardService extends Service {
  initialize() {
    document.addEventListener('copy', (event) => {
      if (targetIsInput(event)) return;
      this.logger.info('handle copy');

      var selection = this.app.selection.map((entity) => (
        entity.expression
      ));

      event.clipboardData.setData('text/x-entity', JSON.stringify(selection));
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
    } catch (e) {
      this.logger.warn('cannot paste x-entity data: ', item.type);
    }
  }

  // something like this...
  // paste(action) {
  //   action.item.getAsString((s) => {
  //     this.app.currentFile.expression.childNodes.push(...JSON.parse(s));
  //   });
  // }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/services/clipboard',
  factory : ClipboardService
});
