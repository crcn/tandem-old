import { Event } from '../../events/index';
import assertPropertyExists from '../../utils/assert/property-exists';

export const LOG = 'log';
export class LogEvent extends Event {
  constructor(public level:number, public message:string) {
    super(LOG);
    assertPropertyExists(this, 'level');
    assertPropertyExists(this, 'message');
  }
}
