import Logger from 'saffron-common/src/logger/index'; 
import loggable from 'saffron-common/src/decorators/loggable';
import BaseApplicationService from 'saffron-common/src/services/base-application-service';
import { ApplicationServiceFragment } from 'saffron-common/src/fragments/index';
import IApplication from 'saffron-common/src/application/interface';


function targetIsInput(event) {
  return /input|textarea/i.test(event.target.nodeName);
}

@loggable
export default class ClipboardService extends BaseApplicationService<IApplication> {

  public logger:Logger;

  initialize() {
    document.addEventListener('copy', (event:any) => {
      if (targetIsInput(event)) return;
      this.logger.info('handle copy');

      // var selection = this.app.selection.map((entity) => (
      //   entity.expression
      // ));

      var selection = [];

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
      // await this.bus.execute({ type: 'paste', item: item });
    } catch (e) {
      this.logger.warn('cannot paste x-entity data: ', item.type);
    }
  }

  // something like this...
  
  
}

export const fragment = new ApplicationServiceFragment('application/services/clipboard', ClipboardService);