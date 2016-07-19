import loggable from 'saffron-common/lib/logger/mixins/loggable';
import { Service } from 'saffron-common/lib/services/index';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';

function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable
export default class ClipboardService extends Service {

  public logger:any;

  initialize() {
    document.addEventListener('copy', (event:any) => {
      if (targetIsInput(event)) return;
      this.logger.info('handle copy');

      var selection = this.app.selection.map((entity) => (
        entity.expression
      ));

      event.clipboardData.setData('text/x-entity', JSON.stringify(selection));
      event.preventDefault();
    });

    document.addEventListener('paste', (event:any) => {
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

export const fragment = new FactoryFragment({
  ns      : 'application/services/clipboard',
  factory : ClipboardService
});
