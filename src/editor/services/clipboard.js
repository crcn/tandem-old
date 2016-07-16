import loggable from 'common/logger/mixins/loggable';
import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';

@loggable
export default class ClipboardService extends Service {
  initialize() {
    document.addEventListener('copy', function(event) {
      event.clipboardData.setData('text/x-entity', Date.now().toString());
      event.preventDefault();
    });

    document.addEventListener('paste', function(event) {
      // if (targetIsInput(event)) return;
      Array.prototype.forEach.call(event.clipboardData.items, paste);
    });

    function paste(item) {
      try {
        console.info('paste %s', item.type);
        // TODO - DO THIS
        item.getAsString(function(s) {
          console.log(s);
        });
      } catch(e) {
        console.warn('cannot paste x-entity data: ', item.type);
      }
    }
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'application/services/clipboard',
  factory : ClipboardService
});
